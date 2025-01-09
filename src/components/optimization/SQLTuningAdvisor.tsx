"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {getSqlTuningAdvisor} from "@/app/actions/optimization";
import {useConnectionStore} from "@/store/useConnectionStore";

interface SQLTuningAdvisorProps {
    selectedQueries: string[]
    openModal: (content: React.ReactNode) => void
}

interface TuningResult {
    sqlId: string
    recommendations: string[]
    executionPlanImprovements: string[]
}

export default function SQLTuningAdvisor({ selectedQueries, openModal }: SQLTuningAdvisorProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [tuningResult, setTuningResult] = useState<string>()

    const { activeConnection } = useConnectionStore();


    const runSQLTuningAdvisor = async () => {
        setIsLoading(true)
        // Mock API call - replace with actual SQL Tuning Advisor call
        /*await new Promise(resolve => setTimeout(resolve, 2000))
        const mockResults: TuningResult[] = selectedQueries.map(sqlId => ({
            sqlId,
            recommendations: ['Create index on column X', 'Rewrite subquery as join'],
            executionPlanImprovements: ['Reduced table scans', 'Improved join order']
        }))*/
        const data = await getSqlTuningAdvisor(activeConnection!, selectedQueries[0])
        console.log(data)
        setTuningResult(data)
        setIsLoading(false)
    }

    const applyRecommendations = async () => {
        openModal(
            <div>
                <h3 className="text-lg font-semibold mb-2">Confirm Apply Recommendations</h3>
                <p>Are you sure you want to apply the tuning recommendations?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => openModal(null)}>Cancel</Button>
                    <Button onClick={() => {
                        // Mock API call to apply recommendations
                        openModal(<p>Recommendations applied successfully!</p>)
                    }}>Apply</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">SQL Tuning Advisor</h2>
            <Button onClick={runSQLTuningAdvisor} disabled={isLoading || selectedQueries.length === 0}>
                {isLoading ? 'Running...' : 'Run SQL Tuning Advisor'}
            </Button>
            {tuningResult  && (
                <div className="space-y-4">
                        <Card>
                            <CardContent>
                                {tuningResult}
                            </CardContent>
                        </Card>
                    {/*<Button onClick={applyRecommendations}>Apply Recommendations</Button>*/}
                </div>
            )}
        </div>
    )
}

