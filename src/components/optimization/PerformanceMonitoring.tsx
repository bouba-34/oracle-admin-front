"use client"

import { useState } from 'react'
import SlowQueriesAnalysis from './SlowQueriesAnalysis'
import SQLTuningAdvisor from './SQLTuningAdvisor'
import RecalculateStatistics from './RecalculateStatistics'
import Modal from './Modal'

export default function PerformanceMonitoring() {
    const [selectedQueries, setSelectedQueries] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null)

    const handleQuerySelection = (sqlId: string, isSelected: boolean) => {
        setSelectedQueries(prev =>
            isSelected ? [...prev, sqlId] : prev.filter(id => id !== sqlId)
        )
    }

    const openModal = (content: React.ReactNode) => {
        setModalContent(content)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <SlowQueriesAnalysis onQuerySelection={handleQuerySelection} openModal={openModal} />
            <SQLTuningAdvisor selectedQueries={selectedQueries} openModal={openModal} />
            <RecalculateStatistics openModal={openModal} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalContent}
            </Modal>
        </div>
    )
}

