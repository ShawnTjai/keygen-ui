import React from "react";
import {useTable} from "@refinedev/react-table";
import {type ColumnDef, flexRender} from "@tanstack/react-table";
import {DateField, DeleteButton, List, ShowButton,} from "@refinedev/mantine";

import {Box, Group, Loader, Pagination, ScrollArea, Table,} from "@mantine/core";

import {ColumnFilter, ColumnSorter} from "../../components";
import IToken from "../../interfaces/token";
import {GetManyResponse, useMany} from "@refinedev/core";
import IProduct from "../../interfaces/product";
import {Link} from "react-router-dom";
import classes from "../../_util/styles/List.module.css"

export const TokenList: React.FC = () => {
  const columns = React.useMemo<ColumnDef<IToken>[]>(
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
              {/*<EditButton hideText recordItemId={getValue() as number}/>*/}
              <DeleteButton hideText recordItemId={getValue() as number}/>
            </Group>
          );
        },
      },
      {
        id: "owner",
        header: "Owner",
        enableColumnFilter: true,
        accessorKey: "relationships.bearer.data",
        cell: function render({getValue, table}) {
          const data = getValue() as {id: string, type: string}
          const meta = table.options.meta as {
            productsData: GetManyResponse<IProduct>;
          };
          const product = meta.productsData?.data.find(
            (item) => item.id === data.id
          );
          if(product) {
            return <Link to={`/products/show/${product?.id}`} className={classes.listLink}>{product?.attributes.name}</Link>;
          } else {
            return ""
          }
        },
      },
      {
        id: "kind",
        header: "Kind",
        accessorKey: "attributes.kind",
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "attributes.name",
      },
      {
        id: "expiry",
        header: "Expiry",
        accessorKey: "attributes.expiry",
        cell: function render({getValue}) {
          const date = getValue() as string
          return date ? <DateField value={getValue() as string} format="LLL"/> : ""
        },
      },
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

  const productIds = tableData?.data?.map((item) => item.relationships.bearer.data.type == "products" ? item.relationships.bearer.data.id : "") ?? [];
  const {data: productsData} = useMany<IProduct>({
    resource: "products",
    ids: productIds,
    queryOptions: {
      enabled: productIds.length > 0,
    },
  });
  console.log({productsData})

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
      productsData,
    },
  }));

  if (isLoading) {
    return (
      <ScrollArea>
        <List>
          <Loader />
        </List>
      </ScrollArea>
    )}

  return (
    <ScrollArea>
      <List canCreate={false}>
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
