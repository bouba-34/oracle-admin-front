"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const BackupPage = () => {
  const [history, setHistory] = useState<string>("");
  const [restoreDate, setRestoreDate] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [scheduleType, setScheduleType] = useState<boolean>(true); // true for incremental backup
  const [isHistoryDialogOpen, setHistoryDialogOpen] = useState(false);
  const { toast } = useToast();

  const runBackup = async (isIncremental: boolean) => {
    try {
      const response = await axios.post("http://localhost:8080/backup/run", {
        incremental: isIncremental,
      });
      toast({
        title: "Backup Successful",
        description: response.data,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data || error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/backup/history");
      setHistory(response.data);
      setHistoryDialogOpen(true);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data || error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const restoreDatabase = async () => {
    if (!restoreDate) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid restore date.",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/backup/restore", {
        restoreDate,
      });
      toast({
        title: "Restore Successful",
        description: response.data,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data || error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const scheduleBackup = async () => {
    if (!scheduleDate) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid date and time for the schedule.",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/schedule/configure", {
        dateTime: scheduleDate,
        isIncremental: scheduleType,
      });
      toast({
        title: "Schedule Successful",
        description: response.data,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data || error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
      });
    }
  };

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Backup Management</h1>

        {/* Backup Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Run Backup</h2>
          <div className="flex gap-4">
            <Button onClick={() => runBackup(false)}>Full Backup</Button>
            <Button variant="secondary" onClick={() => runBackup(true)}>Incremental Backup</Button>
          </div>
        </div>

        {/* History Dialog */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Backup History</h2>
          <Button onClick={fetchHistory}>View History</Button>
          <Dialog open={isHistoryDialogOpen} onOpenChange={setHistoryDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Backup History</DialogTitle>
              </DialogHeader>
              <pre className="p-4 bg-gray-100 rounded">{history || "No history available."}</pre>
              <DialogFooter>
                <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Restore Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Restore Database</h2>
          <div className="flex items-center gap-4">
            <Input
                type="datetime-local"
                value={restoreDate}
                onChange={(e) => setRestoreDate(e.target.value)}
                placeholder="Restore Date"
            />
            <Button onClick={restoreDatabase}>Restore</Button>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Schedule Backup</h2>
          <div className="flex flex-col gap-4">
            <Input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                placeholder="Select Date and Time"
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input
                    type="checkbox"
                    checked={scheduleType}
                    onChange={() => setScheduleType(!scheduleType)}
                />
                Incremental Backup
              </label>
            </div>
            <Button onClick={scheduleBackup}>Schedule Backup</Button>
          </div>
        </div>
      </div>
  );
};

export default BackupPage;
