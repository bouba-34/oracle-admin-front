'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type User = {
  id: string
  username: string
  role: string
  quota: string
  defaultTablespace: string
  temporaryTablespace: string
}

const initialUsers: User[] = [
  { id: '1', username: 'john_doe', role: 'DBA', quota: '100MB', defaultTablespace: 'USERS', temporaryTablespace: 'TEMP' },
  { id: '2', username: 'jane_smith', role: 'Developer', quota: '50MB', defaultTablespace: 'USERS', temporaryTablespace: 'TEMP' },
]

const VALID_ROLES = ['DBA', 'Developer', 'Analyst']
const VALID_TABLESPACES = ['USERS', 'TEMP', 'DATA', 'INDEX'] // Liste des tablespaces disponibles

const isValidUsername = (username: string) =>
    /^[a-zA-Z][a-zA-Z0-9_$#]*$/.test(username)

const isValidQuota = (quota: string) =>
    /^[0-9]+(MB|GB)$/.test(quota)

const isValidTablespace = (tablespace: string) =>
    VALID_TABLESPACES.includes(tablespace)

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [newUser, setNewUser] = useState<Partial<User>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleCreateUser = () => {
    if (!newUser.username || !isValidUsername(newUser.username)) {
      setErrorMessage("Invalid username. Must start with a letter and contain only letters, numbers, _, $, or #.")
      return
    }
    if (users.find((user) => user.username === newUser.username)) {
      setErrorMessage("Username already exists.")
      return
    }
    if (!newUser.role || !VALID_ROLES.includes(newUser.role)) {
      setErrorMessage(`Invalid role. Valid roles are: ${VALID_ROLES.join(", ")}`)
      return
    }
    if (!newUser.quota || !isValidQuota(newUser.quota)) {
      setErrorMessage("Invalid quota. Must be in the format of '100MB' or '1GB'.")
      return
    }
    if (!newUser.defaultTablespace || !isValidTablespace(newUser.defaultTablespace)) {
      setErrorMessage(`Invalid default tablespace. Valid tablespaces are: ${VALID_TABLESPACES.join(", ")}`)
      return
    }
    if (!newUser.temporaryTablespace || !isValidTablespace(newUser.temporaryTablespace)) {
      setErrorMessage(`Invalid temporary tablespace. Valid tablespaces are: ${VALID_TABLESPACES.join(", ")}`)
      return
    }

    setUsers([...users, { ...newUser, id: Date.now().toString() } as User])
    setNewUser({})
    setErrorMessage(null)
    setIsDialogOpen(false)
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
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
                      value={newUser.username || ''}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <Input
                      id="role"
                      value={newUser.role || ''}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      placeholder={`Valid roles: ${VALID_ROLES.join(", ")}`}
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quota" className="text-right">Quota</Label>
                  <Input
                      id="quota"
                      value={newUser.quota || ''}
                      onChange={(e) => setNewUser({ ...newUser, quota: e.target.value })}
                      placeholder="e.g., 100MB or 1GB"
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="defaultTablespace" className="text-right">Default Tablespace</Label>
                  <Input
                      id="defaultTablespace"
                      value={newUser.defaultTablespace || ''}
                      onChange={(e) => setNewUser({ ...newUser, defaultTablespace: e.target.value })}
                      placeholder={`Valid tablespaces: ${VALID_TABLESPACES.join(", ")}`}
                      className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="temporaryTablespace" className="text-right">Temporary Tablespace</Label>
                  <Input
                      id="temporaryTablespace"
                      value={newUser.temporaryTablespace || ''}
                      onChange={(e) => setNewUser({ ...newUser, temporaryTablespace: e.target.value })}
                      placeholder={`Valid tablespaces: ${VALID_TABLESPACES.join(", ")}`}
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
            {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.quota}</TableCell>
                  <TableCell>{user.defaultTablespace}</TableCell>
                  <TableCell>{user.temporaryTablespace}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2">Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  )
}

export default UsersPage
