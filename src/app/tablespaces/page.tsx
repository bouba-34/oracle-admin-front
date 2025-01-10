"use client"
import React, { useEffect, useState } from 'react';
import {createTableSpace, deleteTableSpace, getAllTableSpaces, getTableSpaceDetail} from "@/app/actions/tablespaces";
import { TableSpace, TableSpaceDetail, TableSpaceInfo } from "@/types";
import { useConnectionStore } from "@/store/useConnectionStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon, UpdateIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const TableSpaceManagementPage = () => {
    const [tableSpaces, setTableSpaces] = useState<TableSpaceInfo[]>([]);
    const [isAddTableSpaceDialogOpen, setAddTableSpaceDialogOpen] = useState(false);
    const [selectedTableSpace, setSelectedTableSpace] = useState<TableSpaceInfo>();
    const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tableSpaceDetail, setTableSpaceDetail] = useState<TableSpaceDetail>();
    const [includingContentsAndDataFiles, setIncludingContentsAndDataFiles] = useState(false);
    const { toast } = useToast();
    const [newTableSpace, setNewTableSpace] = useState<TableSpace>({
        name: "",
        dataFilePath: "",
        size: "",
        maxSize: "",
        autoExtend: false,
    });
    const { activeConnection } = useConnectionStore();

    useEffect(() => {
        document.title = "TableSpace Management";
        if (!activeConnection) return;
        const fetchTableSpaces = async () => {
            const data = await getAllTableSpaces(activeConnection!);
            setTableSpaces(data);
        };
        if(activeConnection?.id !== undefined) {
            fetchTableSpaces();
        }
    }, [activeConnection]);

    const handleAddTableSpace = async () => {
        try {
            await createTableSpace(newTableSpace, activeConnection!);
            setNewTableSpace({
                name: "",
                dataFilePath: "",
                size: "",
                maxSize: "",
                autoExtend: false,
            });
            toast({
                title: "Success",
                description: "TableSpace created successfully",
            });
            setAddTableSpaceDialogOpen(false);
            const updatedTableSpaces = await getAllTableSpaces(activeConnection!);
            setTableSpaces(updatedTableSpaces);
        } catch (e: any) {
            toast({
                title: "Error",
                description: e.response?.data?.message || "An error occurred",
            });
        }
    };

    const handleOpenDetail = async (name: string) => {
        try {
            const data = await getTableSpaceDetail(name, activeConnection!);
            setTableSpaceDetail(data[0]);
            setDetailDialogOpen(true); // Ouvre le dialogue
            console.log(tableSpaceDetail)
            //console.log("data", data)
        } catch (e: any) {
            toast({
                title: "Error",
                description: e.response?.data?.message || "An error occurred",
            });
        }
    }

    const handleDeleteTableSpace = async () => {
         try {
             await deleteTableSpace(selectedTableSpace!.name, includingContentsAndDataFiles, activeConnection!);
             toast({
                 title: "Success",
                 description: "TableSpace deleted successfully" + (includingContentsAndDataFiles ? " including contents and data files" : ""),
             });
             setDeleteDialogOpen(false);
             setSelectedTableSpace(undefined);
             const updatedTableSpaces = await getAllTableSpaces(activeConnection!);
             setTableSpaces(updatedTableSpaces);
         } catch (e: any) {
             toast({
                 title: "Error",
                 description: e.response?.data?.message || "An error occurred",
             });
         }
    }

    if(activeConnection?.id === undefined) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Tablespaces Management</h1>
                <p className="mt-4">Please select a connection to view the tablespaces.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tablespaces Management</h1>

            {/* Add Tablespace Dialog */}
            <Dialog open={isAddTableSpaceDialogOpen} onOpenChange={setAddTableSpaceDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-4">New TableSpace</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new TableSpace</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Name"
                        value={newTableSpace.name}
                        onChange={(e) => setNewTableSpace({ ...newTableSpace, name: e.target.value })}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Data File Path"
                        value={newTableSpace.dataFilePath}
                        onChange={(e) => setNewTableSpace({ ...newTableSpace, dataFilePath: e.target.value })}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Size"
                        value={newTableSpace.size}
                        onChange={(e) => setNewTableSpace({ ...newTableSpace, size: e.target.value })}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Max Size"
                        value={newTableSpace.maxSize}
                        onChange={(e) => setNewTableSpace({ ...newTableSpace, maxSize: e.target.value })}
                        className="mb-4"
                    />
                    <Label>Auto Extend</Label>
                    <RadioGroup
                        value={newTableSpace.autoExtend ? "true" : "false"}
                        onValueChange={(value) =>
                            setNewTableSpace({ ...newTableSpace, autoExtend: value === "true" })
                        }
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="r1" />
                            <Label htmlFor="r1">ON</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="r2" />
                            <Label htmlFor="r2">OFF</Label>
                        </div>
                    </RadioGroup>
                    {newTableSpace.autoExtend && (
                        <Input
                            placeholder="Increment Size"
                            value={newTableSpace.incrementSize}
                            onChange={(e) => setNewTableSpace({ ...newTableSpace, incrementSize: e.target.value })}
                            className="mb-4"
                        />
                    )}
                    <DialogFooter>
                        <Button onClick={handleAddTableSpace}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* TableSpace Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contents</TableHead>
                        <TableHead>Next Extent</TableHead>
                        <TableHead>Segment Space Management</TableHead>
                        <TableHead>Extent Management</TableHead>
                        <TableHead>Allocation Type</TableHead>
                        <TableHead>Initial Extent</TableHead>
                        <TableHead>Block Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableSpaces.map((tablespace) => (
                        <TableRow key={tablespace.name}>
                            <TableCell>{tablespace.name}</TableCell>
                            <TableCell>{tablespace.contents || "N/A"}</TableCell>
                            <TableCell>{tablespace.next_extent + " octets" || "N/A"}</TableCell>
                            <TableCell>{tablespace.segment_space_management || "N/A"}</TableCell>
                            <TableCell>{tablespace.extent_management || "N/A"}</TableCell>
                            <TableCell>{tablespace.allocation_type || "N/A"}</TableCell>
                            <TableCell>{tablespace.initial_extent + " octets" || "N/A"}</TableCell>
                            <TableCell>{tablespace.block_size + " octets" || "N/A"}</TableCell>
                            <TableCell>{tablespace.status || "N/A"}</TableCell>
                            <TableCell>
                                <Button size="icon" variant="destructive" className="mr-2"
                                    onClick={() => {
                                        setSelectedTableSpace(tablespace);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <TrashIcon />
                                </Button>
                                <Button size="icon" variant="ghost" className="bg-blue-200">
                                    <UpdateIcon />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleOpenDetail(tablespace.name)}>
                                    <InfoCircledIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>TableSpace Details</DialogTitle>
                    </DialogHeader>
                    {tableSpaceDetail ? (
                        <div>
                            <p><strong>AutoExtensible:</strong> {tableSpaceDetail.autoextensible}</p>
                            <p><strong>Size:</strong> {tableSpaceDetail.size_mb}</p>
                            <p><strong>Max Size:</strong> {tableSpaceDetail.max_size_mb}</p>
                            <p><strong>File Directory:</strong> {tableSpaceDetail.file_name}</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete TableSpace</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete the TableSpace <strong>{selectedTableSpace?.name}</strong>?</p>
                        <Label>
                            <RadioGroup
                                value={includingContentsAndDataFiles ? "true" : "false"}
                                onValueChange={(value) => setIncludingContentsAndDataFiles(value === "true")}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="r1" />
                                    <Label htmlFor="r1">Including Contents and Data Files</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="r2" />
                                    <Label htmlFor="r2">Only TableSpace</Label>
                                </div>
                            </RadioGroup>
                        </Label>
                        <DialogFooter>
                            <Button onClick={handleDeleteTableSpace}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
        </div>
    );
};

export default TableSpaceManagementPage;
