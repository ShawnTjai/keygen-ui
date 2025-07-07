import React from "react";
import {useTable} from "@refinedev/react-table";
import {type ColumnDef, flexRender} from "@tanstack/react-table";
import {BooleanField, DateField, DeleteButton, EditButton, List, ShowButton,} from "@refinedev/mantine";

import {Box, Group, Loader, Pagination, ScrollArea, Table,} from "@mantine/core";

import {ColumnFilter, ColumnSorter} from "../../components";
import IPolicy from "../../interfaces/policy";
import {GetManyResponse, useMany} from "@refinedev/core";
import IProduct from "../../interfaces/product";
import {IconCheck, IconX} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import classes from "../../_util/styles/List.module.css"

export const PolicyList: React.FC = () => {
  const columns = React.useMemo<ColumnDef<IPolicy>[]>(
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
      // {
      //     id: "id",
      //     header: "ID",
      //     accessorKey: "id",
      // },
      // {
      //     id: "type",
      //     header: "Type",
      //     accessorKey: "type",
      // },
      {
        id: "product",
        header: "Product",
        enableColumnFilter: true,
        accessorKey: "relationships.product.data.id",
        cell: function render({getValue, table}) {
          const id = getValue() as string
          const meta = table.options.meta as {
            productsData: GetManyResponse<IProduct>;
          };
          const product = meta.productsData?.data.find(
            (item) => item.id === getValue(),
          );
          return product ? <Link to={`/products/show/${id}`} className={classes.listLink}>{product?.attributes.name}</Link> : "Loading...";
        },
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "attributes.name",
      },
      {
        id: "duration",
        header: "Duration",
        accessorKey: "attributes.duration",
      },
      // {
      //     id: "strict",
      //     header: "Strict",
      //     accessorKey: "attributes.strict",
      // },
      // {
      //     id: "floating",
      //     header: "Floating",
      //     accessorKey: "attributes.floating",
      // },
      // {
      //     id: "scheme",
      //     header: "Scheme",
      //     accessorKey: "attributes.scheme",
      // },
      // {
      //     id: "requireProductScope",
      //     header: "Require Product Scope",
      //     accessorKey: "attributes.requireProductScope",
      // },
      // {
      //     id: "requirePolicyScope",
      //     header: "Require Policy Scope",
      //     accessorKey: "attributes.requirePolicyScope",
      // },
      // {
      //     id: "requireMachineScope",
      //     header: "Require Machine Scope",
      //     accessorKey: "attributes.requireMachineScope",
      // },
      // {
      //     id: "usePool",
      //     header: "Use Pool",
      //     accessorKey: "attributes.usePool",
      // },
      // {
      //     id: "maxMachines",
      //     header: "Max Machines",
      //     accessorKey: "attributes.maxMachines",
      // },
      // {
      //     id: "maxProcesses",
      //     header: "Max Processes",
      //     accessorKey: "attributes.maxProcesses",
      // },
      // {
      //     id: "maxUsers",
      //     header: "Max Users",
      //     accessorKey: "attributes.maxUsers",
      // },
      // {
      //     id: "maxCores",
      //     header: "Max Cores",
      //     accessorKey: "attributes.maxCores",
      // },
      {
        id: "maxUses",
        header: "Max Uses",
        accessorKey: "attributes.maxUses",
      },
      // {
      //     id: "machineUniquenessStrategy",
      //     header: "Machine Uniqueness Strategy",
      //     accessorKey: "attributes.machineUniquenessStrategy",
      // },
      // {
      //     id: "machineMatchingStrategy",
      //     header: "Machine Matching Strategy",
      //     accessorKey: "attributes.machineMatchingStrategy",
      // },
      // {
      //     id: "componentUniquenessStrategy",
      //     header: "Component Uniqueness Strategy",
      //     accessorKey: "attributes.componentUniquenessStrategy",
      // },
      // {
      //     id: "componentMatchingStrategy",
      //     header: "Component Matching Strategy",
      //     accessorKey: "attributes.componentMatchingStrategy",
      // },
      // {
      //     id: "expirationStrategy",
      //     header: "Expiration Strategy",
      //     accessorKey: "attributes.expirationStrategy",
      // },
      // {
      //     id: "expirationBasis",
      //     header: "Expiration Basis",
      //     accessorKey: "attributes.expirationBasis",
      // },
      // {
      //     id: "renewalBasis",
      //     header: "Renewal Basis",
      //     accessorKey: "attributes.renewalBasis",
      // },
      // {
      //     id: "transferStrategy",
      //     header: "Transfer Strategy",
      //     accessorKey: "attributes.transferStrategy",
      // },
      // {
      //     id: "authenticationStrategy",
      //     header: "Authentication Strategy",
      //     accessorKey: "attributes.authenticationStrategy",
      // },
      // {
      //     id: "machineLeasingStrategy",
      //     header: "Machine Leasing Strategy",
      //     accessorKey: "attributes.machineLeasingStrategy",
      // },
      // {
      //     id: "overageStrategy",
      //     header: "Overage Strategy",
      //     accessorKey: "attributes.overageStrategy",
      // },
      // {
      //     id: "encrypted",
      //     header: "Encrypted",
      //     accessorKey: "attributes.encrypted",
      // },
      // {
      //     id: "protected",
      //     header: "Protected",
      //     accessorKey: "attributes.protected",
      // },
      // {
      //     id: "requireFingerprintScope",
      //     header: "Require Fingerprint Scope",
      //     accessorKey: "attributes.requireFingerprintScope",
      // },
      // {
      //     id: "processLeasingStrategy",
      //     header: "Process Leasing Strategy",
      //     accessorKey: "attributes.processLeasingStrategy",
      // },
      // {
      //     id: "requireComponentsScope",
      //     header: "Require Components Scope",
      //     accessorKey: "attributes.requireComponentsScope",
      // },
      // {
      //     id: "requireUserScope",
      //     header: "Require User Scope",
      //     accessorKey: "attributes.requireUserScope",
      // },
      // {
      //     id: "requireChecksumScope",
      //     header: "Require Checksum Scope",
      //     accessorKey: "attributes.requireChecksumScope",
      // },
      // {
      //     id: "requireVersionScope",
      //     header: "Require Version Scope",
      //     accessorKey: "attributes.requireVersionScope",
      // },
      {
        id: "requireCheckIn",
        header: "Require Check In",
        accessorKey: "attributes.requireCheckIn",
        cell: function render({getValue}) {
          return (
            <BooleanField value={getValue() as boolean}
                          trueIcon={<IconCheck />}
                          falseIcon={<IconX />}
            />
          );
        },
      },
      // {
      //     id: "checkInInterval",
      //     header: "Check In Interval",
      //     accessorKey: "attributes.checkInInterval",
      // },
      // {
      //     id: "checkInIntervalCount",
      //     header: "Check In Interval Count",
      //     accessorKey: "attributes.checkInIntervalCount",
      // },
      // {
      //     id: "heartbeatDuration",
      //     header: "Heartbeat Duration",
      //     accessorKey: "attributes.heartbeatDuration",
      // },
      // {
      //     id: "heartbeatCullStrategy",
      //     header: "HeartbeatCull Strategy",
      //     accessorKey: "attributes.heartbeatCullStrategy",
      // },
      // {
      //     id: "heartbeatResurrectionStrategy",
      //     header: "HeartbeatResurrection Strategy",
      //     accessorKey: "attributes.heartbeatResurrectionStrategy",
      // },
      // {
      //     id: "heartbeatBasis",
      //     header: "Heartbeat Basis",
      //     accessorKey: "attributes.heartbeatBasis",
      // },
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
      // {
      //     id: "metadata",
      //     header: "Metadata",
      //     accessorKey: "attributes.metadata",
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
      // {
      //   id: "title",
      //   header: "Title",
      //   accessorKey: "title",
      //   meta: {
      //     filterOperator: "contains",
      //   },
      // },
      // {
      //   id: "status",
      //   header: "Status",
      //   accessorKey: "status",
      //   meta: {
      //     filterElement: function render(props: FilterElementProps) {
      //       return (
      //         <Select
      //           defaultValue="published"
      //           data={[
      //             { label: "Published", value: "published" },
      //             { label: "Draft", value: "draft" },
      //             { label: "Rejected", value: "rejected" },
      //           ]}
      //           {...props}
      //         />
      //       );
      //     },
      //     filterOperator: "eq",
      //   },
      // },
      // {
      //   id: "category.id",
      //   header: "Category",
      //   enableColumnFilter: false,
      //   accessorKey: "category.id",
      //   cell: function render({ getValue, table }) {
      //     const meta = table.options.meta as {
      //       categoriesData: GetManyResponse<ICategory>;
      //     };
      //     const category = meta.categoriesData?.data.find(
      //       (item) => item.id === getValue(),
      //     );
      //     return category?.title ?? "Loading...";
      //   },
      // },
      // {
      //   id: "createdAt",
      //   header: "Created At",
      //   accessorKey: "createdAt",
      //   cell: function render({ getValue }) {
      //     return <DateField value={getValue() as string} format="LLL" />;
      //   },
      //   enableColumnFilter: false,
      // },
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
  const productIds = tableData?.data?.map((item) => item.relationships.product.data.id) ?? [];
  const {data: productsData} = useMany<IProduct>({
    resource: "products",
    ids: productIds,
    queryOptions: {
      enabled: productIds.length > 0,
    },
  });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
      productsData,
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
