'use client';

import { useState } from 'react';

import { registerMonitor } from '@/app/actions';


export default function MonitorForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    url: 'https://www.google.com',
    method: 'GET',
    headers: '',
    body: '',
    timeout: 5000,
    expected_status_code: 200,
    latency_threshold: 1000,
    healthy_threshold: 3,
    failure_threshold: 3,
    schedule_interval: 10000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: propsIsNumber(name) ? Number(value) : value,
    }));
  };

  const propsIsNumber = (name: string) => {
    return [
      'timeout',
      'expected_status_code',
      'latency_threshold',
      'healthy_threshold',
      'failure_threshold',
      'schedule_interval',
    ].includes(name);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (formData.schedule_interval < 3000) {
        throw new Error('Schedule interval must be at least 3000ms');
      }

      let parsedHeaders = {};
      if (formData.headers) {
        try {
          parsedHeaders = JSON.parse(formData.headers);
        } catch {
          throw new Error('Headers must be valid JSON');
        }
      }

      let parsedBody = {};
      if (formData.body && ['POST', 'PUT', 'PATCH'].includes(formData.method)) {
        try {
          parsedBody = JSON.parse(formData.body);
        } catch {
          throw new Error('Body must be valid JSON');
        }
      }

      const payload = {
        url: formData.url,
        method: formData.method,
        headers: parsedHeaders,
        body: parsedBody,
        timeout: formData.timeout,
        expected_status_code: formData.expected_status_code,
        latency_threshold: formData.latency_threshold,
        healthy_threshold: formData.healthy_threshold,
        failure_threshold: formData.failure_threshold,
        schedule_interval: formData.schedule_interval,
      };

      const result = await registerMonitor(payload);

      if (!result.success) {
        throw new Error(result.error);
      }

      setMessage({ type: 'success', text: 'Monitor registered successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to register monitor' });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-none bg-black border border-cyan-800 text-cyan-300 shadow-sm p-2 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink focus:outline-none transition-colors placeholder-gray-700";
  const labelClasses = "block text-sm font-medium text-cyan-500 uppercase tracking-wide";

  return (
    <div className="bg-slate-900/80 p-6 rounded-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,243,255,0.1)] mb-8 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>

      <h2 className="text-xl font-bold mb-6 text-neon-blue border-b border-cyan-900 pb-2">Initialize Protocol</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL & Method */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className={labelClasses}>Target URL</label>
            <input
              type="url"
              name="url"
              required
              value={formData.url}
              onChange={handleChange}
              className={inputClasses}
              placeholder="https://api.example.com/health"
            />
          </div>
          <div>
            <label className={labelClasses}>Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>

        {/* JSON Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Headers (JSON)</label>
            <textarea
              name="headers"
              value={formData.headers}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses} font-mono text-xs`}
              placeholder='{"Authorization": "Bearer token"}'
            />
          </div>
          <div>
            <label className={labelClasses}>Body (JSON)</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses} font-mono text-xs`}
              placeholder='{"key": "value"}'
              disabled={['GET', 'DELETE'].includes(formData.method)}
            />
          </div>
        </div>

        {/* Thresholds Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClasses}>Timeout (ms)</label>
            <input
              type="number"
              name="timeout"
              value={formData.timeout}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Status Code</label>
            <input
              type="number"
              name="expected_status_code"
              value={formData.expected_status_code}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Latency Max</label>
            <input
              type="number"
              name="latency_threshold"
              value={formData.latency_threshold}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Thresholds Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClasses}>Healthy Thresh</label>
            <input
              type="number"
              name="healthy_threshold"
              value={formData.healthy_threshold}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Failure Thresh</label>
            <input
              type="number"
              name="failure_threshold"
              value={formData.failure_threshold}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Schedule Interval Slider */}
        <div className="bg-black/30 p-4 border border-cyan-900 rounded">
          <label className={`${labelClasses} flex justify-between`}>
            <span>Scan Interval</span>
            <span className="text-neon-pink font-mono">{formData.schedule_interval}ms</span>
          </label>
          <input
            type="range"
            name="schedule_interval"
            min="3000"
            max="60000"
            step="1000"
            value={formData.schedule_interval}
            onChange={handleChange}
            className="w-full mt-3 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-pink"
          />
          <style jsx>{`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 16px;
              width: 16px;
              border-radius: 50%;
              background: #ff00ff;
              box-shadow: 0 0 10px #ff00ff;
              cursor: pointer;
              margin-top: -4px;
            }
            input[type=range]::-webkit-slider-runnable-track {
              width: 100%;
              height: 8px;
              cursor: pointer;
              background: #111;
              border-radius: 4px;
              border: 1px solid #333;
            }
          `}</style>
          <p className="text-xs text-cyan-600/70 mt-2 font-mono">
            // MINIMUM SAFE INTERVAL: 3000ms
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-cyan-900/50">
          {message && (
            <div className={`text-sm px-4 py-2 border ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-500' : 'bg-red-900/20 text-red-400 border-red-500'} font-mono`}>
              {message.type === 'success' ? '[SUCCESS] ' : '[ERROR] '}{message.text}
            </div>
          )}
          {!message && <div></div>} {/* Spacer */}

          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 bg-transparent border border-neon-blue text-neon-blue font-bold uppercase tracking-widest hover:bg-neon-blue hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] ${loading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {loading ? 'TRANSMITTING...' : 'INITIATE'}
          </button>
        </div>
      </form>
    </div>
  );
}
