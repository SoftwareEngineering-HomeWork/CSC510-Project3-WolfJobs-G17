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

    if (liveJobs && liveJobs.positions.length === 0) {
        return <div>No live jobs available</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>Live Jobs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {liveJobs?.positions.map((position, index) => (
                    <div key={index} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#fff', transition: 'box-shadow 0.3s', cursor: 'pointer' }} 
                         onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'} 
                         onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                        <h3 style={{ margin: '0', color: '#FF5353', fontSize: '20px', fontWeight: '600' }}>{position}</h3>
                        <p style={{ margin: '5px 0', color: '#555', fontSize: '16px' }}>Department: {liveJobs.departments[index]}</p>
                        <a href={liveJobs.links[index]} target="_blank" rel="noopener noreferrer" 
                           style={{ display: 'inline-block', marginTop: '10px', padding: '10px 15px', backgroundColor: '#FF5353', color: 'white', textDecoration: 'none', borderRadius: '5px', transition: 'background-color 0.3s', fontSize: '16px' }} 
                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e03e3e'} 
                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5353'}>
                            Apply Here
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveJobsView;