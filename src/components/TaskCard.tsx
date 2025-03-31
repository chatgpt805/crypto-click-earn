
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PTCTask } from "@/lib/supabase";
import { completeTask } from "@/lib/api";
import { useState } from "react";
import { ExternalLink } from "lucide-react";

interface TaskCardProps {
  task: PTCTask;
  onComplete: () => void;
}

const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const getCryptoDetails = () => {
    switch (task.crypto_type) {
      case 'pepe':
        return {
          name: 'PEPE',
          textColor: 'text-pepe',
        };
      case 'dash':
        return {
          name: 'DASH',
          textColor: 'text-dash',
        };
      case 'ltc':
        return {
          name: 'LTC',
          textColor: 'text-ltc',
        };
      default:
        return {
          name: '',
          textColor: '',
        };
    }
  };

  const { name, textColor } = getCryptoDetails();

  const handleSubmit = async () => {
    if (!proof) return;
    
    setLoading(true);
    try {
      await completeTask(task.id, proof);
      onComplete();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="task-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{task.description}</CardTitle>
        <CardDescription>
          Reward: <span className={`font-bold ${textColor}`}>{task.price.toFixed(6)} {name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-gray-400" />
          <a 
            href={task.task_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-400 hover:underline"
          >
            {task.task_link}
          </a>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">Complete Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Task Completion</DialogTitle>
              <DialogDescription>
                Provide proof that you've completed the task. This can be a screenshot URL or description.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="proof">Proof of completion</Label>
                <Input
                  id="proof"
                  placeholder="Enter screenshot URL or description"
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSubmit} 
                disabled={!proof || loading}
              >
                {loading ? "Submitting..." : "Submit Proof"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
