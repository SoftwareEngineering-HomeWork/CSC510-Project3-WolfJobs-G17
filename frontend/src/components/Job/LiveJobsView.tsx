// path/to/LiveJobsView.tsx
import { useEffect, useState } from "react";
import axios from "axios";

const LiveJobsView = () => {
    const [liveJobs, setLiveJobs] = useState<{ departments: string[]; links: string[]; positions: string[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLiveJobs = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5007/live-wolfjobs");
                setLiveJobs(response.data);
            } catch (err) {
                setError("Error fetching live jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchLiveJobs();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="live-jobs-container">
            <h2 className="text-2xl py-4">Live Jobs</h2>
            <div className="jobs-list">
                {liveJobs?.positions.map((position, index) => (
                    <div key={index} className="job-item">
                        <h3>{position}</h3>
                        <p>Department: {liveJobs.departments[index]}</p>
                        <a href={liveJobs.links[index]} target="_blank" rel="noopener noreferrer">Apply Here</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveJobsView;