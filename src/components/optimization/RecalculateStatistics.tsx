"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'

interface RecalculateStatisticsProps {
    openModal: (content: React.ReactNode) => void
}

export default function RecalculateStatistics({ openModal }: RecalculateStatisticsProps) {
    const [selectedObjects, setSelectedObjects] = useState<string[]>([])
    const [isRecalculating, setIsRecalculating] = useState(false)
    const [progress, setProgress] = useState(0)

    const mockObjects = [
        { name: 'users', type: 'table' },
        { name: 'orders', type: 'table' },
        { name: 'idx_user_email', type: 'index' },
        { name: 'idx_order_date', type: 'index' },
    ]

    const handleObjectSelection = (objectName: string, isSelected: boolean) => {
        setSelectedObjects(prev =>
            isSelected ? [...prev, objectName] : prev.filter(name => name !== objectName)
        )
    }

    const recalculateStatistics = async () => {
        setIsRecalculating(true)
        setProgress(0)

        // Mock recalculation process
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 500))
            setProgress(i)
        }

        setIsRecalculating(false)
        openModal(<p>Statistics recalculation completed successfully!</p>)
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recalculate Statistics</h2>
            <div className="space-y-2">
                {mockObjects.map((obj) => (
                    <div key={obj.name} className="flex items-center space-x-2">
                        <Checkbox
                            id={obj.name}
                            onCheckedChange={(checked) => handleObjectSelection(obj.name, checked as boolean)}
                        />
                        <label htmlFor={obj.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {obj.name} ({obj.type})
                        </label>
                    </div>
                ))}
            </div>
            <Button
                onClick={recalculateStatistics}
                disabled={isRecalculating || selectedObjects.length === 0}
            >
                {isRecalculating ? 'Recalculating...' : 'Recalculate Statistics'}
            </Button>
            {isRecalculating && (
                <Progress value={progress} className="w-full" />
            )}
        </div>
    )
}

