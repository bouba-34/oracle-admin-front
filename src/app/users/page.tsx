'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {User, UserData} from "@/types";
import {createUser, deleteUser, getAllUsers} from "@/app/actions/users";
import {useConnectionStore} from "@/store/useConnectionStore";
import { useToast } from "@/hooks/use-toast";





const UsersPage = () => {
  const [users, setUsers] = useState<UserData[]>()
  const [newUser, setNewUser] = useState<User>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { activeConnection } = useConnectionStore();
  const { toast } = useToast();



  useEffect(() => {
    document.title = "User Management"
    const fetchUsers = async () => {
      const data = await getAllUsers(activeConnection!)
      setUsers(data)
    }
    fetchUsers()
  }, []);


  const handleCreateUser = async () => {
    try {
      if (!newUser?.newUsername || !newUser?.newPassword || !newUser?.newRole || !newUser?.quota || !newUser?.defaultTablespace || !newUser?.temporaryTablespace) {
        setErrorMessage("All fields are required.")
        return
      }

      const data = await createUser(newUser, activeConnection!)
      const updatedUsers = await getAllUsers(activeConnection!)
      setUsers(updatedUsers)
      setIsDialogOpen(false)
      if(data.status === 500){
        toast({
            title: "Error",
            description: 'Error creating user',
        })
      }else {
        toast({
            title: "Success",
            description: "User created",
        })
      }
        setNewUser(undefined)
        setErrorMessage(null)

    } catch (e: any) {
      toast({
        title: "Error",
        description: `${e.message}`,
      });
    }
  }

  const handleDeleteUser = (username: string) => {
    try {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Are you sure you want to delete user ${username}?`)) {
            // eslint-disable-next-line no-restricted-globals
            deleteUser(username, activeConnection!).then(() => {
            setUsers(users?.filter((user) => user.username !== username))
            toast({
                title: "Success",
                description: `User ${username} has been deleted`
            })
            }).catch((e) => {
            toast({
                title: "Error",
                description: `${e.message}`,
            });
            })
        }
    }catch (e:any) {
        toast({
            title: "Error",
            description: `${e.message}`,
        });
    }
  }

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <div className="mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Enter the details for the new Oracle user.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">Username</Label>
                  <Input
                      id="username"
                      value={newUser?.newUsername || ''}
                      onChange={(e) => setNewUser({...newUser, newUsername: e.target.value})}
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input
                      id="password"
                      value={newUser?.newPassword || ''}
                      onChange={(e) => setNewUser({...newUser, newPassword: e.target.value})}
                      className="col-span-3"
                      type={"password"}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <Input
                      id="role"
                      value={newUser?.newRole || ''}
                      onChange={(e) => setNewUser({...newUser, newRole: e.target.value})}
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quota" className="text-right">Quota</Label>
                  <Input
                      id="quota"
                      value={newUser?.quota || ''}
                      onChange={(e) => setNewUser({...newUser, quota: e.target.value})}
                      placeholder="e.g., 100MB or 1GB"
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="defaultTablespace" className="text-right">Default Tablespace</Label>
                  <Input
                      id="defaultTablespace"
                      value={newUser?.defaultTablespace || ''}
                      onChange={(e) => setNewUser({...newUser, defaultTablespace: e.target.value})}
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="temporaryTablespace" className="text-right">Temporary Tablespace</Label>
                  <Input
                      id="temporaryTablespace"
                      value={newUser?.temporaryTablespace || ''}
                      onChange={(e) => setNewUser({...newUser, temporaryTablespace: e.target.value})}
                      placeholder={`Valid tablespaces: Temp, ...}`}
                      className="col-span-3"
                  />
                </div>
                {errorMessage && (
                    <div className="text-red-500 col-span-4">{errorMessage}</div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleCreateUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Quota</TableHead>
              <TableHead>Default Tablespace</TableHead>
              <TableHead>Temporary Tablespace</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.roles.map((role) => (
                        `${role}`
                  ))}</TableCell>
                  <TableCell>{user.quotas.map((q) => (
                        `${q.bytes_mb} MB / ${q.max_bytes_mb} MB (${q.tablespace_name})`
                  ) )}</TableCell>
                  <TableCell>{user.default_tablespace}</TableCell>
                  <TableCell>{user.temporary_tablespace}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2">Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.username)}>Delete</Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  )
}

export default UsersPage
