import React from "react";
import {useTable} from "@refinedev/react-table";
import {type ColumnDef, flexRender} from "@tanstack/react-table";
import {BooleanField, DateField, DeleteButton, EditButton, List, ShowButton, TextField,} from "@refinedev/mantine";

import {Box, Group, Loader, Pagination, ScrollArea, Table,} from "@mantine/core";

import {ColumnFilter, ColumnSorter} from "../../components";
import {IconCheck, IconX} from "@tabler/icons-react";
import formatSeconds from "../../_util/resource/formatSeconds";
import {GetManyResponse, useMany} from "@refinedev/core";
import ILicense from "../../interfaces/license";
import IMachine from "../../interfaces/machine";
import { Link } from "react-router-dom";
import classes from "../../_util/styles/List.module.css"

export const MachineList: React.FC = () => {
  const columns = React.useMemo<ColumnDef<IMachine>[]>(
    () => [
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
        cell: function render({getValue}) {
          return (
            <Group spacing="xs" noWrap>
              <ShowButton hideText recordItemId={getValue() as number}/>
              <EditButton hideText recordItemId={getValue() as number}/>
              <DeleteButton hideText recordItemId={getValue() as number}/>
            </Group>
          );
        },
      },
      {
        id: "fingerprint",
        header: "Fingerprint",
        accessorKey: "attributes.fingerprint",
      },
      {
        id: "license",
        header: "License",
        enableColumnFilter: true,
        accessorKey: "relationships.license.data.id",
        cell: function render({ getValue, table }) {
          const id = getValue() as string;
          const meta = table.options.meta as {
            licensesData: GetManyResponse<ILicense>;
          };
          const license = meta.licensesData?.data.find(
            (item) => item.id === id,
          );
          return license ? <Link to={`/licenses/show/${id}`} className={classes.listLink}>{license?.attributes.key}</Link> : "Loading...";
        },
      },
      {
        id: "cores",
        header: "Cores",
        accessorKey: "attributes.cores",
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "attributes.name",
      },
      {
        id: "ip",
        header: "IP",
        accessorKey: "attributes.ip",
      },
      {
        id: "hostname",
        header: "Hostname",
        accessorKey: "attributes.hostname",
      },
      {
        id: "platform",
        header: "Platform",
        accessorKey: "attributes.platform",
      },
      {
        id: "maxProcesses",
        header: "Max Processes",
        accessorKey: "attributes.maxProcesses",
      },
      {
        id: "requireHeartbeat",
        header: "Require Heartbeat",
        accessorKey: "attributes.requireHeartbeat",
        cell: function render({getValue}) {
          return (
            <BooleanField value={getValue() as boolean}
                          trueIcon={<IconCheck />}
                          falseIcon={<IconX />}
            />
          );
        },
      },
      {
        id: "heartbeatStatus",
        header: "Heartbeat Status",
        accessorKey: "attributes.heartbeatStatus",
      },
      {
        id: "heartbeatDuration",
        header: "Heartbeat Duration",
        accessorKey: "attributes.heartbeatDuration",
        cell: function render({getValue}) {
          return (
            <TextField value={formatSeconds(Number(getValue()), false)}/>
          );
        },
      },
      // {
      //   id: "lastHeartbeat",
      //   header: "Last Heartbeat",
      //   accessorKey: "attributes.lastHeartbeat",
      // },
      // {
      //   id: "nextHeartbeat",
      //   header: "Next Heartbeat",
      //   accessorKey: "attributes.nextHeartbeat",
      // },
      // {
      //   id: "lastCheckOut",
      //   header: "Last CheckOut",
      //   accessorKey: "attributes.lastCheckOut",
      // },
      {
        "id": "created",
        "header": "Created",
        "accessorKey": "attributes.created",
        cell: function render({getValue}) {
          return <DateField value={getValue() as string} format="LLL"/>;
        },
      },
      {
        "id": "updated",
        "header": "Updated",
        "accessorKey": "attributes.updated",
        cell: function render({getValue}) {
          return <DateField value={getValue() as string} format="LLL"/>;
        },
      },
    ],
    [],
  );

  const {
    getHeaderGroups,
    getRowModel,
    setOptions,
    refineCore: {
      setCurrent,
      pageCount,
      current,
      tableQuery: {data: tableData, isLoading},
    },
  } = useTable({
    columns,
    refineCoreProps: {
      meta: {
        getTotalPages: (response: {
          links?: {
            meta?: {
              pages?: number;
              count?: number;
            }
          }
        }) => response?.links?.meta?.pages ?? 1,
      },
    },
  });
  // const categoryIds = tableData?.data?.map((item) => item.category.id) ?? [];
  // const { data: categoriesData } = useMany<ICategory>({
  //   resource: "categories",
  //   ids: categoryIds,
  //   queryOptions: {
  //     enabled: categoryIds.length > 0,
  //   },
  // });

  const licenseIds = tableData?.data?.map((item) => item.relationships.license.data.id) ?? [];
  const { data: licensesData } = useMany<ILicense>({
    resource: "licenses",
    ids: licenseIds,
    queryOptions: {
      enabled: licenseIds.length > 0,
    },
  });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
      licensesData,
      // categoriesData,
    },
  }));
  if (isLoading) {
    return (
      <ScrollArea>
        <List>
          <Loader/>
        </List>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea>
      <List>
        <Table highlightOnHover>
          <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id}>
                    {!header.isPlaceholder && (
                      <Group spacing="xs" noWrap>
                        <Box>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </Box>
                        <Group spacing="xs" noWrap>
                          <ColumnSorter column={header.column}/>
                          <ColumnFilter column={header.column}/>
                        </Group>
                      </Group>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
          </thead>
          <tbody>
          {getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
        </Table>
        <br/>
        <Pagination
          position="right"
          total={pageCount || (tableData?.links?.meta?.pages ?? 1)}
          page={current}
          onChange={setCurrent}
        />
      </List>
    </ScrollArea>
  );
};
