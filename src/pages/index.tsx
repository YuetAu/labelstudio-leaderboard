import { use, useEffect, useState } from "react";
import { Box, Flex, Image, Spinner, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useToast } from "@chakra-ui/react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { customNickname, exceptionalCase, teamMember } from "@/props/teamMember";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Head from "next/head";

type User = {
    username: string,
    nickname?: string,
    email: string,
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
                    return (<Flex>
                    {(info.row.original.nickname || info.getValue())}
                    <Tooltip label={(info.row.original.nickname ? info.getValue() + " " : "") + info.row.original.email} placement="right">
                        <span style={{marginLeft: "0.5rem", marginTop: "0.2rem"}}><IoMdInformationCircleOutline /></span>
                    </Tooltip>
                    </Flex>);
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

    const processData = (data: any) => {
        let tmpArr: any = [];
        Object.keys(data).forEach(key => {
            let tmpName = key
            let nickname = undefined
            let tmpEmail = key
            const nameArr = key.split(" ");
            if (nameArr.length >= 2) {
                const nameIndex = nameArr.length - 1
                tmpName = nameArr.slice(0, nameIndex).join(" ");
                tmpEmail = nameArr[nameIndex];

                if (tmpEmail.includes("@connect.ust.hk")) {
                    const itsc = tmpEmail.split("@")[0];
                    if (Object.keys(teamMember).includes(itsc)) {
                        tmpName = teamMember[itsc as keyof typeof teamMember];
                        if (Object.keys(customNickname).includes(itsc)) {
                            nickname = customNickname[itsc as keyof typeof customNickname];
                        }
                    }
                }

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
            } else if (Object.keys(exceptionalCase).includes(key)) {
                tmpName = exceptionalCase[key as keyof typeof exceptionalCase];

                if (Object.keys(customNickname).includes(key)) {
                    nickname = customNickname[key as keyof typeof customNickname];
                }
            }

            let tmpObj = { username: tmpName, score: data[key], nickname: nickname || undefined, email: tmpEmail };
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
                    processData(data);
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


    const [clickCount, setClickCount] = useState(0);

    const [fuckUDunPlay, setFuckUDunPlay] = useState<any>(null);
    const [giveMePoints, setGiveMePoints] = useState<any>(null);
    const [isAnAccident, setIsAnAccident] = useState<any>(null);
    const [motherfucker, setMotherfucker] = useState<any>(null);
    const [sorryXi, setSorryXi] = useState<any>(null);
    const [xiTea, setXiTea] = useState<any>(null);
    const [woodenFish, setWoodenFish] = useState<any>(null);
    const [kimJongUn, setKimJongUn] = useState<any>(null);
    useEffect(() => {
        setFuckUDunPlay(new Audio("/sounds/FuckUDunPlay.mp3"));
        setGiveMePoints(new Audio("/sounds/GiveMePoints.mp3"));
        setIsAnAccident(new Audio("/sounds/IsAnAccident.mp3"));
        setMotherfucker(new Audio("/sounds/Motherfucker.mp3"));
        setSorryXi(new Audio("/sounds/SorryXi.mp3"));
        setXiTea(new Audio("/sounds/XiTea.mp3"));
        setWoodenFish(new Audio("/sounds/WoodenFish.mp3"));
        setKimJongUn(new Audio("/sounds/KimChungUn.mp3"));
    }, [])


    const triggerSound = (nickname: string) => {
        switch (nickname) {
            case "SW Marco":
                setClickCount((prev)=>{
                    if (prev >= 10) {
                        window.location.href = "https://realmarco-2004.labelstudio-leaderboard.pages.dev/";
                        return 0;
                    }
                    return prev+1;
                });
                const random = Math.random();
                if (random < 0.3) {
                    fuckUDunPlay.currentTime = 0
                    fuckUDunPlay.play();
                } else if (random < 0.6) {
                    giveMePoints.currentTime = 0
                    isAnAccident.play();
                } else if (random < 0.9) {
                    motherfucker.currentTime = 0
                    motherfucker.play();
                } else {
                    xiTea.currentTime = 0
                    xiTea.play();
                }
                break;
            case "OG Henry":
                woodenFish.currentTime = 0
                woodenFish.play();
                break;
            case "HW Danny":
                kimJongUn.currentTime = 0
                kimJongUn.play();
                break;
        }
    }

    const colorChange = (nickname: string) => {
        switch (nickname) {
            case "SW Marco":
                return `rgb(${clickCount * (255 / 10)}, 0, 0)`;
            default:
                return "black";
        }
    }


    return (
    <>
        <Head>
            <title>Label Studio - Leaderboard</title>
        </Head>
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
                        <Text fontSize={"xx-large"} textAlign={"center"}>Season 2</Text>
                        
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
                                            <Tr
                                                key={row.id}
                                                onClick={() => {
                                                    triggerSound(row.original.username || "");
                                                }}
                                                sx={{
                                                    textColor: colorChange(row.original.username || "")
                                                }}
                                            >
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
