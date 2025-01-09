'use client'

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {useConnectionStore} from "@/store/useConnectionStore";

const AUDIT_ACTIONS = ['SELECT', 'INSERT', 'UPDATE', 'DELETE']

const SecurityPage = () => {

    const [encryptionTablespaceName, setEncryptionTablespaceName] = useState('')
    //const [columnName, setColumnName] = useState('')
    const [encryptionType, setEncryptionType] = useState('AES128')
    const [auditTableName, setAuditTableName] = useState('')
    const [selectedActions, setSelectedActions] = useState<string[]>([])
    const { toast } = useToast();
    const { activeConnection } = useConnectionStore();

    const handleSubmitEncryption = () => {
        //console.log('Submit')

    }

    const handleActionChange = (action: string) => {
        setSelectedActions(prev =>
            prev.includes(action)
                ? prev.filter(a => a !== action)
                : [...prev, action]
        )
    }


    const handleSubmitAudit = () => {
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Security</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10">
                {/* Encryption Configuration Section */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">TDE Configuration</h1>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="tablespaceName" className="block mb-1">Tablespace Name</label>
                            <input
                                type="text"
                                id="tablespaceName"
                                value={encryptionTablespaceName}
                                onChange={(e) => setEncryptionTablespaceName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="encryptionType" className="block mb-1">Encryption Type</label>
                            <select
                                id="encryptionType"
                                value={encryptionType}
                                onChange={(e) => setEncryptionType(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="AES128">AES128</option>
                                <option value="AES192">AES192</option>
                                <option value="AES256">AES256</option>
                            </select>
                        </div>
                        <Button onClick={handleSubmitEncryption} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Submit
                        </Button>
                    </form>
                </div>

                {/* Audit Configuration Section */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">Audit Configuration</h1>
                    <form onSubmit={handleSubmitAudit} className="space-y-4">
                        <div>
                            <label htmlFor="tableName" className="block mb-1">Table Name</label>
                            <input
                                type="text"
                                id="tableName"
                                value={auditTableName}
                                onChange={(e) => setAuditTableName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Actions to Audit</label>
                            <div className="space-y-2">
                                {AUDIT_ACTIONS.map(action => (
                                    <label key={action} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedActions.includes(action)}
                                            onChange={() => handleActionChange(action)}
                                            className="mr-2"
                                        />
                                        {action}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SecurityPage;