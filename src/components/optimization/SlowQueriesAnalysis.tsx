"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {getSlowQueries} from "@/app/actions/optimization";
import {useConnectionStore} from "@/store/useConnectionStore";

interface SlowQuery {
    sqlId: string
    executionTime: number
    queryText: string
    numberOfExecutions: number
    lastExecutionTime: string
}

interface SlowQueriesAnalysisProps {
    onQuerySelection: (sqlId: string, isSelected: boolean) => void
    openModal: (content: React.ReactNode) => void
}

export default function SlowQueriesAnalysis({ onQuerySelection, openModal }: SlowQueriesAnalysisProps) {
    const [slowQueries, setSlowQueries] = useState<SlowQuery[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('')
    const { activeConnection } = useConnectionStore();


    const fetchSlowQueries = async () => {
        setIsLoading(true)
        // Mock API call - replace with actual database query
        /*await new Promise(resolve => setTimeout(resolve, 1000))
        const mockQueries: SlowQuery[] = [
            { sqlId: 'SQL001', executionTime: 5.2, queryText: 'SELECT * FROM large_table', numberOfExecutions: 100, lastExecutionTime: '2023-05-01 10:30:00' },
            { sqlId: 'SQL002', executionTime: 3.7, queryText: 'SELECT COUNT(*) FROM users', numberOfExecutions: 500, lastExecutionTime: '2023-05-01 11:15:00' },
        ]*/
        const data = await getSlowQueries(activeConnection!)
        setSlowQueries(data)
        setIsLoading(false)
    }

    const filteredQueries = slowQueries.filter(query =>
        query.sqlId.toLowerCase().includes(filter.toLowerCase()) ||
        query.queryText.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Slow Queries Analysis</h2>
            <div className="flex space-x-2">
                <Button onClick={fetchSlowQueries} disabled={isLoading}>
                    {isLoading ? 'Fetching...' : 'Fetch Slow Queries'}
                </Button>
                <Button onClick={fetchSlowQueries} variant="outline">Refresh</Button>
                <Input
                    placeholder="Filter by SQL ID or query text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        <TableHead>SQL ID</TableHead>
                        <TableHead>Execution Time (s)</TableHead>
                        <TableHead>Query Text</TableHead>
                        <TableHead>Number of Executions</TableHead>
                        <TableHead>Last Execution Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredQueries.map((query) => (
                        <TableRow key={query.sqlId}>
                            <TableCell>
                                <Checkbox
                                    onCheckedChange={(checked) => onQuerySelection(query.sqlId, checked as boolean)}
                                />
                            </TableCell>
                            <TableCell>{query.sqlId}</TableCell>
                            <TableCell>{query.executionTime}</TableCell>
                            <TableCell>
                                <Button
                                    variant="link"
                                    onClick={() => openModal(
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Query Text</h3>
                                            <pre className="bg-gray-100 p-2 rounded">{query.queryText}</pre>
                                        </div>
                                    )}
                                >
                                    View
                                </Button>
                            </TableCell>
                            <TableCell>{query.numberOfExecutions}</TableCell>
                            <TableCell>{query.lastExecutionTime}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

