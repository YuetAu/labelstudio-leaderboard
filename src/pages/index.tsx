import { use, useEffect, useState } from "react";
import { Box, Image, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

type User = {
    username: string,
    score: number,
}

export default function Home() {

    const [data, setData] = useState<User[]>([]);
    const columnHelper = createColumnHelper<User>();

    const columns = [
        columnHelper.accessor('username', {
            header: 'Name',
            cell: info => info.getValue(),
            footer: props => props.column.id,
            size: 240,
        }),
        columnHelper.accessor('score', {
            header: 'Task Completed',
            cell: info => info.getValue(),
            footer: props => props.column.id,
            size: 70,
        })
    ];

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })


    const [isGoingToFetch, setIsGoingToFetch] = useState(true);

    const procressData = (data: any) => {
        let tmpArr: any = [];
        Object.keys(data).forEach(key => {
            let tmpObj = { username: key, score: data[key] };
            tmpArr.push(tmpObj);
        });
        setData(tmpArr);
    }

    useEffect(() => {
        if (isGoingToFetch) {
            fetch("https://leaderboard-api.ustrobocon.win/top_annotators")
                .then(response => response.json())
                .then(data => {
                    procressData(data);
                    setIsGoingToFetch(false);
                });
        }
    }, [isGoingToFetch])


    return (
    <>
        <Box display="flex" justifyContent="center" bg="gray.400" h="100vh">
                <Box borderRadius="md" w="80%" maxWidth={"30rem"} h="80vh" maxHeight={"50rem"} boxShadow="0 0 10px rgba(0, 0, 0, 0.2)" mt={"4rem"} pt={"1rem"} bg="white" overflow={"hidden"}>
                        <Image src="/labelstudio.png" h="12%" mx="auto" />
                        <Text fontSize={"xx-large"} textAlign={"center"}>Leaderboard</Text>
                        

                        <Table mt={"1rem"}>
                            <Thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <Th key={header.id} width={header.getSize()}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </Th>
                                        ))}
                                    </Tr>
                                ))}
                            </Thead>
                        </Table>
                        <div
                            style={{
                                overflowY: "scroll",
                                height: "54vh",
                                scrollbarWidth: "none",
                                scrollbarColor: "transparent transparent",
                            }}
                        >
                        <Table>
                            <Tbody>
                                {table.getRowModel().rows.map(row => (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <Td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        </div>
                </Box>
        </Box>
    </>
    )
}
