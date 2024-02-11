import { use, useEffect, useState } from "react";
import { Box, Flex, Image, Spinner, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useToast } from "@chakra-ui/react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { customNickname, exceptionalCase, teamMember } from "@/props/teamMember";
import { IoMdInformationCircleOutline } from "react-icons/io";

type User = {
    username: string,
    nickname?: string,
    score: number,
}

export default function Home() {

    const toast = useToast();

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
    const [nextUpdate, setNextUpdate] = useState(Date.now());

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
        toast({
            title: "Leaderboard Updated",
            description: "Leaderboard has been updated",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    }

    useEffect(() => {
        if (isGoingToFetch) {
            fetch("https://leaderboard-api.ustrobocon.win/top_annotators")
                .then(response => response.json())
                .then(data => {
                    procressData(data);
                    setIsGoingToFetch(false);
                })
                .then(() => {
                    const delay = 65000+Math.random()*1000
                    setTimeout(() => {
                        setIsGoingToFetch(true);
                    }, delay);
                    setNextUpdate(Date.now() + delay);
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


    const [currentUnixTime, setCurrentUnixTime] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentUnixTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
    <>
        <Box sx={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            zIndex: "10",
        }}>
            <Flex>
                <Spinner /><Text mt={"0.1rem"} ml={"0.5rem"}>{nextUpdate - currentUnixTime > 1000 ? "Next update in " + Math.floor((nextUpdate - currentUnixTime)/1000) + " seconds" : "Updating..."}</Text>
            </Flex>
        </Box>
        <Box display="flex" justifyContent="center" bg="gray.400" h={windowHeight}>
                <Box borderRadius="md" w="80%" maxWidth={"30rem"} h={"80%"} maxHeight={"70rem"} boxShadow="0 0 10px rgba(0, 0, 0, 0.2)" mt={"4rem"} pt={"1rem"} bg="white" overflow={"hidden"}>
                        <Image src="/labelstudio.png" h="12%" mx="auto" />
                        <Text fontSize={"xx-large"} textAlign={"center"}>Leaderboard</Text>
                        
                        {
                            isGoingToFetch && data.length === 0
                            ? (<Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                                mx="auto"
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                            />)
                            :
                            (<>
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
                            </>)
                        }
                </Box>
        </Box>
    </>
    )
}
