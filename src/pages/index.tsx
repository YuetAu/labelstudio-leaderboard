import { use, useEffect, useState } from "react";
import { Box, Flex, Image, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { customNickname, exceptionalCase, teamMember } from "@/props/teamMember";
import { IoMdInformationCircleOutline } from "react-icons/io";

type User = {
    username: string,
    nickname?: string,
    score: number,
}

export default function Home() {

    const [data, setData] = useState<User[]>([]);
    const columnHelper = createColumnHelper<User>();

    const columns = [
        columnHelper.accessor('username', {
            header: 'Name',
            cell: info => {
                if (info.row.original.nickname === undefined) {
                    return info.getValue();
                } else {
                    return (<Flex>
                    {info.row.original.nickname}
                    <Tooltip label={info.getValue()} placement="right">
                        <span style={{marginLeft: "0.5rem"}}><IoMdInformationCircleOutline /></span>
                    </Tooltip>
                    </Flex>);
                }
            },
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
            let tmpName = key
            let nickname = undefined
            const nameArr = key.split(" ");
            if (nameArr.length == 2) {
                tmpName = nameArr[0];
                if (Object.keys(exceptionalCase).includes(nameArr[1])) {
                    tmpName = exceptionalCase[nameArr[1] as keyof typeof exceptionalCase];
                }

                if (Object.keys(customNickname).includes(nameArr[1])) {
                    nickname = customNickname[nameArr[1] as keyof typeof customNickname];
                }
            } else if (key.includes("@connect.ust.hk")) {
                const itsc = key.split("@")[0];
                if (Object.keys(teamMember).includes(itsc)) {
                    tmpName = teamMember[itsc as keyof typeof teamMember];
                }

                if (Object.keys(customNickname).includes(itsc)) {
                    nickname = customNickname[itsc as keyof typeof customNickname];
                }
            }

            let tmpObj = { username: tmpName, score: data[key], nickname: nickname || undefined };
            tmpArr.push(tmpObj);
        });
        tmpArr.sort((a: any, b: any) => b.score - a.score);
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

    const [windowHeight, setWindowHeight] = useState(0);
    useEffect(() => {
        setWindowHeight(window.innerHeight);
        window.addEventListener('resize', () => {
            setWindowHeight(window.innerHeight);
        });
    }, []);


    return (
    <>
        <Box display="flex" justifyContent="center" bg="gray.400" h={windowHeight}>
                <Box borderRadius="md" w="80%" maxWidth={"30rem"} h={"80%"} maxHeight={"70rem"} boxShadow="0 0 10px rgba(0, 0, 0, 0.2)" mt={"4rem"} pt={"1rem"} bg="white" overflow={"hidden"}>
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
                                overflowX: "hidden",
                                overflowY: "scroll",
                                height: "65%",
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
