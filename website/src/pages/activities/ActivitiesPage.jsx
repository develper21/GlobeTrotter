import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Sparkles, Clock, DollarSign, MapPin, Filter } from 'lucide-react';
import api from '../../lib/api';
import { SkeletonCard } from '../../components/common/Loader';
import './ActivitiesPage.css';

const CATEGORIES = ['All', 'Sightseeing', 'Adventure', 'Food & Dining', 'Culture', 'Nightlife', 'Shopping', 'Nature', 'Transport', 'Other'];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cityFilter, setCityFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { limit: 24 };
        if (search) params.search = search;
        if (category !== 'All') params.type = category;
        if (cityFilter) params.cityId = cityFilter;
        const { data } = await api.get('/activities', { params });
        const activitiesData = data.data?.activities || data.data || data.activities || [];
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setTotal(data.meta?.total || data.data?.total || data.total || activitiesData.length);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setError(err.message || 'Failed to fetch activities');
        setActivities([]);
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [search, category, cityFilter]);

  return (
    <div className="activities-page container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="page-header activities-header">
        <div>
          <div className="badge badge-amber" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={12} /> Global Activity Catalog
          </div>
          <h1 className="page-title">Explore Activities 🎯</h1>
          <p className="page-subtitle">{total || 'Global'} activities across destinations with costs & duration info</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="activities-filters glass-card">
        <div className="activities-search-bar">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search by activity name, type, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`category-tab ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div style={{ marginTop: '2rem' }}>
          <SkeletonCard count={8} />
        </div>
      ) : error ? (
        <div className="empty-state error-state glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <span className="badge badge-rose">Connection Error</span>
          <h3 style={{ color: 'var(--accent)', margin: '0.75rem 0' }}>Failed to Load Activities</h3>
          <p style={{ maxWidth: '550px', margin: '0 auto 1.5rem', color: '#495057' }}>
            Verify your backend API service is operational.
          </p>
        </div>
      ) : (activities || []).length === 0 ? (
        <div className="empty-activities-card glass-card">
          <Compass size={64} color="#714B67" />
          <h3>No Activities Found</h3>
          <p>Try searching for a different activity or changing the category filter.</p>
        </div>
      ) : (
        <motion.div 
          className="activities-grid-page" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.04 }}
        >
          {activities.map((activity, i) => (
            <motion.div key={activity.id || activity._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="activity-card glass-card">
                {activity.image && (
                  <div className="activity-image">
                    <img 
                      src={activity.image} 
                      alt={activity.name}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                <div className="activity-body">
                  <div className="activity-category-badge">
                    <Compass size={12} /> {activity.type || 'Activity'}
                  </div>
                  <h3 className="activity-name">{activity.name}</h3>
                  {activity.description && (
                    <p className="activity-description">{activity.description.substring(0, 120)}...</p>
                  )}
                  <div className="activity-meta">
                    <span className="activity-meta-item">
                      <Clock size={14} /> {activity.durationMinutes || 60} min
                    </span>
                    <span className="activity-meta-item">
                      <DollarSign size={14} /> ${activity.estimatedCost || 0}
                    </span>
                  </div>
                  {activity.city && (
                    <div className="activity-city">
                      <MapPin size={12} /> {activity.city.name || activity.city}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
