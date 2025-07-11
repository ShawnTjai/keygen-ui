import React from "react";
import {useTable} from "@refinedev/react-table";
import {type ColumnDef, flexRender} from "@tanstack/react-table";
import {
    List,
    ShowButton,
    EditButton,
    DeleteButton,
    DateField,
} from "@refinedev/mantine";

import {
    Box,
    Group,
    ScrollArea,
    Table,
    Pagination, Loader,
} from "@mantine/core";

import {ColumnFilter, ColumnSorter} from "../../components";
import IProduct from "../../interfaces/product";
import classes from "../../_util/styles/List.module.css"

export const ProductList: React.FC = () => {
    const columns = React.useMemo<ColumnDef<IProduct>[]>(
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
                id: "id",
                header: "ID",
                accessorKey: "id",
            },
            {
                id: "type",
                header: "Type",
                accessorKey: "type",
            },
            {
                id: "name",
                header: "Name",
                accessorKey: "attributes.name",
            },
            {
                id: "distributionStrategy",
                header: "DistributionStrategy",
                accessorKey: "attributes.distributionStrategy"
            },
            // {
            //     id: "url",
            //     header: "Url",
            //     accessorKey: "attributes.url"
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
            tableQuery: { data: tableData, isLoading },
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

    setOptions((prev) => ({
        ...prev,
        meta: {
            ...prev.meta,
            // categoriesData,
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
