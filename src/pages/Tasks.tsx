
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import TaskCard from "@/components/TaskCard";
import { getTasks } from "@/lib/api";
import { PTCTask } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

const Tasks = () => {
  const [tasks, setTasks] = useState<PTCTask[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">PTC Tasks</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-48">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="animate-pulse h-6 w-32 bg-secondary rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={fetchTasks} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No tasks available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
