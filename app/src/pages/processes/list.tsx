import React from "react";
import {useTable} from "@refinedev/react-table";
import {type ColumnDef, flexRender} from "@tanstack/react-table";
import {DateField, DeleteButton, EditButton, List, ShowButton,} from "@refinedev/mantine";

import {Box, Group, Loader, Pagination, ScrollArea, Table,} from "@mantine/core";

import {ColumnFilter, ColumnSorter} from "../../components";
import {GetManyResponse, useMany} from "@refinedev/core";
import ILicense from "../../interfaces/license";
import IProcess from "../../interfaces/process";
import IMachine from "../../interfaces/machine";

export const ProcessList: React.FC = () => {
    const columns = React.useMemo<ColumnDef<IProcess>[]>(
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
                id: "license",
                header: "License",
                enableColumnFilter: true,
                accessorKey: "relationships.license.data.id",
                cell: function render({ getValue, table }) {
                    const meta = table.options.meta as {
                        licensesData: GetManyResponse<ILicense>;
                    };
                    const license = meta.licensesData?.data.find(
                        (item) => item.id === getValue(),
                    );
                    return license?.attributes.key ?? "Loading...";
                },
            },
            {
                id: "machine",
                header: "Machine",
                enableColumnFilter: true,
                accessorKey: "relationships.machine.data.id",
                cell: function render({ getValue, table }) {
                    const meta = table.options.meta as {
                        machinesData: GetManyResponse<IMachine>;
                    };
                    const machine = meta.machinesData?.data.find(
                        (item) => item.id === getValue(),
                    );
                    return machine?.attributes.fingerprint ?? "Loading...";
                },
            },
            {
                id: "pid",
                header: "Pid",
                accessorKey: "attributes.pid",
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

    const licenseIds = tableData?.data?.map((item) => item.relationships.license.data.id) ?? [];
    const { data: licensesData } = useMany<ILicense>({
        resource: "licenses",
        ids: licenseIds,
        queryOptions: {
            enabled: licenseIds.length > 0,
        },
    });

    const machineIds = tableData?.data?.map((item) => item.relationships.machine.data.id) ?? [];
    const { data: machinesData } = useMany<IMachine>({
        resource: "machines",
        ids: machineIds,
        queryOptions: {
            enabled: machineIds.length > 0,
        },
    });

    setOptions((prev) => ({
        ...prev,
        meta: {
            ...prev.meta,
            licensesData,
            machinesData,
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
