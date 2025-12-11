class SystemService {
  constructor() {
    this.systemData = {};
    this.initialize();
  }

  initialize() {
    this.systemData = {
      expansion: {
        category: 'Expansion',
        description: 'System growth and hardware expansion planning',
        color: '#e8d3ba',
        branches: [
          {
            id: 'exp-compute',
            name: 'Compute Expansion',
            status: 'In Progress',
            items: [
              { name: 'CPU Upgrade', status: 'Planned', cost: '$450', timeline: '3 months' },
              { name: 'Memory Modules', status: 'In Stock', cost: '$280', quantity: '2x32GB' },
              { name: 'GPU Accelerators', status: 'Ordered', cost: '$1200', eta: '2 weeks' },
              { name: 'SSD Storage', status: 'Installed', cost: '$520', capacity: '4TB NVMe' }
            ]
          },
          {
            id: 'exp-storage',
            name: 'Storage Expansion',
            status: 'Completed',
            items: [
              { name: 'Backup Arrays', status: 'Active', capacity: '20TB', redundancy: 'RAID-6' },
              { name: 'Archive Storage', status: 'Planned', capacity: '100TB', type: 'Cold Storage' },
              { name: 'Database Cluster', status: 'In Progress', nodes: 5, replication: 'Multi-region' },
              { name: 'Network Storage', status: 'Operational', bandwidth: '10Gbps', utilization: '62%' }
            ]
          }
        ]
      },
      inventory: {
        category: 'Inventory',
        description: 'System components and resource tracking',
        color: '#e8d3ba',
        branches: [
          {
            id: 'inv-hardware',
            name: 'Hardware Inventory',
            status: 'Active',
            items: [
              { name: 'Server Units', count: 8, health: '100%', uptime: '99.8%' },
              { name: 'Network Switches', count: 4, bandwidth: '40Gbps', status: 'Optimal' },
              { name: 'Power Supplies', count: 12, capacity: '10kW', backup: 'Active UPS' },
              { name: 'Cooling Units', count: 6, capacity: '15kW', efficiency: '94%' }
            ]
          },
          {
            id: 'inv-software',
            name: 'Software Inventory',
            status: 'Active',
            items: [
              { name: 'OS Licenses', count: 8, type: 'Linux Enterprise', status: 'Valid' },
              { name: 'Database', count: 2, type: 'PostgreSQL 15', version: 'Latest' },
              { name: 'Dev Tools', count: 15, updates: 'Current', security: 'Patched' },
              { name: 'Monitoring Stack', count: 3, status: 'Operational', coverage: '100%' }
            ]
          }
        ]
      },
      iot: {
        category: 'IoT & Sensors',
        description: 'Internet of Things devices and sensor networks',
        color: '#e8d3ba',
        branches: [
          {
            id: 'iot-sensors',
            name: 'Sensor Network',
            status: 'Monitoring',
            items: [
              { name: 'Temperature Sensors', count: 24, accuracy: '±0.5°C', response: '2s' },
              { name: 'Humidity Sensors', count: 24, range: '0-100%', calibration: 'Recent' },
              { name: 'Power Monitors', count: 12, precision: '1W', logging: 'Continuous' },
              { name: 'Motion Detectors', count: 8, range: '50m', sensitivity: 'Adjustable' }
            ]
          },
          {
            id: 'iot-devices',
            name: 'Connected Devices',
            status: 'Active',
            items: [
              { name: 'Smart Controllers', count: 6, firmware: 'v2.4.1', connectivity: 'WiFi/Mesh' },
              { name: 'Edge Gateways', count: 3, processing: 'Local AI', bandwidth: 'Optimized' },
              { name: 'Mobile Nodes', count: 15, battery: '72h avg', sync: 'Real-time' },
              { name: 'Gateway Hubs', count: 2, throughput: '500 msg/s', reliability: '99.9%' }
            ]
          }
        ]
      },
      plugins: {
        category: 'Plugin Marketplace',
        description: 'Extensions and plugins for system functionality',
        color: '#e8d3ba',
        branches: [
          {
            id: 'plugin-installed',
            name: 'Installed Plugins',
            status: 'Active',
            items: [
              { name: 'Weather Integration', version: '2.1', status: 'Active', rating: '4.8/5' },
              { name: 'Backup Manager', version: '3.0', status: 'Running', reliability: '99.95%' },
              { name: 'Analytics Engine', version: '1.5', status: 'Processing', data_points: '2.3M/day' },
              { name: 'Notification Hub', version: '2.3', status: 'Active', delivery: '99.8%' }
            ]
          },
          {
            id: 'plugin-available',
            name: 'Available Plugins',
            status: 'Ready',
            items: [
              { name: 'Advanced Forecasting', version: '1.0', size: '45MB', rating: '4.6/5' },
              { name: 'Machine Learning Kit', version: '2.0', size: '120MB', rating: '4.9/5' },
              { name: 'Custom Dashboard', version: '1.2', size: '20MB', rating: '4.4/5' },
              { name: 'Third-party API Sync', version: '1.8', size: '35MB', rating: '4.7/5' }
            ]
          }
        ]
      },
      resilience: {
        category: 'Resilience',
        description: 'System resilience and disaster recovery',
        color: '#e8d3ba',
        branches: [
          {
            id: 'resilience-backup',
            name: 'Backup Systems',
            status: 'Protected',
            items: [
              { name: 'Daily Snapshots', frequency: '6/day', retention: '30 days', verification: 'Automated' },
              { name: 'Incremental Backups', frequency: 'Hourly', retention: '7 days', compression: 'LZ4' },
              { name: 'Offsite Replication', location: 'Remote DC', latency: '45ms', sync: 'Continuous' },
              { name: 'Disaster Recovery', rpo: '1 hour', rto: '4 hours', testing: 'Monthly' }
            ]
          },
          {
            id: 'resilience-failover',
            name: 'Failover & Recovery',
            status: 'Ready',
            items: [
              { name: 'Primary Cluster', nodes: 5, status: 'Healthy', load: '62%' },
              { name: 'Secondary Cluster', nodes: 3, status: 'Standby', auto_switch: 'Enabled' },
              { name: 'Load Balancer', type: 'Dual Active', health_check: '500ms', failover: '<1s' },
              { name: 'Recovery Scripts', count: 12, tested: 'Last 7 days', automation: '95%' }
            ]
          }
        ]
      }
    };
  }

  getSystemData(category) {
    return this.systemData[category] || null;
  }

  getAllSystemData() {
    return this.systemData;
  }

  getExpansionData() {
    return this.systemData.expansion;
  }

  getInventoryData() {
    return this.systemData.inventory;
  }

  getIoTData() {
    return this.systemData.iot;
  }

  getPluginData() {
    return this.systemData.plugins;
  }

  getResilienceData() {
    return this.systemData.resilience;
  }

  updateSystemStatus(category, updates) {
    if (this.systemData[category]) {
      this.systemData[category] = {
        ...this.systemData[category],
        ...updates
      };
      return true;
    }
    return false;
  }
}

const systemService = new SystemService();
export default systemService;
