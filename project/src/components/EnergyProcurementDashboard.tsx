import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, MessageSquare, ChevronUp, ChevronDown } from 'lucide-react';
import { PlantData, EnergyContract, SubmissionStatus } from '../types';
import StatusIndicator from './StatusIndicator';
import ContactInfoPanel from './ContactInfoPanel';
import QuarterlyReportGrid from './QuarterlyReportGrid';
import EnergyCharts from './EnergyCharts';
import AggregatedEnergyChart from './AggregatedEnergyChart';
import MeteringPointsList from './MeteringPointsList';
import EnergyContracts from './EnergyContracts';
import { v4 as uuidv4 } from 'uuid';

const demoContracts: EnergyContract[] = [
  {
    id: '1',
    supplier: 'EnergieStadt AG',
    type: 'electricity',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    volume: 12000,
    price: 180.50,
    fixedShare: 70,
    variableShare: 30
  },
  {
    id: '2',
    supplier: 'GasNetz GmbH',
    type: 'gas',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    volume: 800000,
    price: 0.85,
    fixedShare: 60,
    variableShare: 40
  }
];

const calculatePlantStatus = (meteringPoints: PlantData['meteringPoints']): SubmissionStatus => {
  if (meteringPoints.length === 0) return 'none';
  
  if (meteringPoints.every(point => point.status === 'submitted')) {
    return 'submitted';
  }
  
  if (meteringPoints.some(point => point.status === 'pending')) {
    return 'pending';
  }
  
  return 'none';
};

const demoPlants: PlantData[] = [
  {
    id: '1',
    name: 'Werk001',
    lastReport: new Date(),
    pendingReports: [],
    historicalAverage: {
      electricity: 1200,
      gas: 800
    },
    contact: {
      name: 'Max Mustermann',
      email: 'max.mustermann@werk001.de',
      phone: '+49 123 456789',
      role: 'Energiemanager'
    },
    comments: [
      {
        id: '1',
        text: 'Wartungsarbeiten vom 15.03 bis 29.03',
        timestamp: new Date('2025-03-10T10:30:00')
      }
    ],
    energyData: {
      consumption: {
        electricity: {
          current: 1250,
          previous: 1200,
          unit: 'MWh',
          status: 'reported'
        },
        gas: {
          current: 800,
          previous: 750,
          unit: 'MWh',
          status: 'reported'
        }
      },
      generation: {
        pv: {
          capacity: 500,
          generation: 450,
          unit: 'kWh',
          status: 'active'
        },
        chp: {
          capacity: 1000,
          generation: 850,
          unit: 'kWh',
          status: 'active'
        }
      },
      quarterlyReports: [
        {
          quarter: 1,
          year: 2024,
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2024, 2, 31),
          submissionDate: new Date(2024, 3, 5),
          consumption: {
            electricity: 3750,
            gas: 2400
          },
          generation: {
            pv: 1350,
            chp: 2550
          }
        }
      ]
    },
    submissionStatus: 'submitted',
    meteringPoints: [
      {
        id: 'mp1',
        name: 'Hauptzähler',
        meteringPointId: 'DE00012345',
        billingRecipientId: 'RE98765',
        institute: 'Institut A',
        endConsumer: 'Werk001 GmbH',
        year: 2025,
        status: 'submitted',
        reportingMethod: 'smartmeter'
      },
      {
        id: 'mp2',
        name: 'Produktionshalle',
        meteringPointId: 'DE00012346',
        billingRecipientId: 'RE98766',
        institute: 'Institut B',
        endConsumer: 'Werk001 GmbH',
        year: 2025,
        status: 'pending',
        reportingMethod: 'manual'
      }
    ]
  },
  {
    id: '2',
    name: 'Werk002',
    lastReport: null,
    pendingReports: ['Stromverbrauch Januar', 'Gasverbrauch Januar'],
    historicalAverage: {
      electricity: 950,
      gas: 600
    },
    contact: {
      name: 'Anna Schmidt',
      email: 'anna.schmidt@werk002.de',
      phone: '+49 234 567890',
      role: 'Technische Leitung'
    },
    comments: [],
    energyData: {
      consumption: {
        electricity: {
          current: 980,
          previous: 950,
          unit: 'MWh',
          status: 'pending'
        },
        gas: {
          current: 620,
          previous: 600,
          unit: 'MWh',
          status: 'pending'
        }
      },
      generation: {
        pv: {
          capacity: 300,
          generation: 280,
          unit: 'kWh',
          status: 'maintenance'
        },
        chp: {
          capacity: 800,
          generation: 0,
          unit: 'kWh',
          status: 'inactive'
        }
      }
    },
    submissionStatus: 'pending',
    meteringPoints: [
      {
        id: 'mp3',
        name: 'Hauptzähler',
        meteringPointId: 'DE00023456',
        billingRecipientId: 'RE87654',
        institute: 'Institut C',
        endConsumer: 'Werk002 GmbH',
        year: 2025,
        status: 'pending',
        reportingMethod: 'manual'
      },
      {
        id: 'mp4',
        name: 'Produktionshalle Nord',
        meteringPointId: 'DE00023457',
        billingRecipientId: 'RE87655',
        institute: 'Institut C',
        endConsumer: 'Werk002 GmbH',
        year: 2025,
        status: 'none',
        reportingMethod: 'smartmeter'
      }
    ]
  }
];

const EnergyProcurementDashboard: React.FC = () => {
  const [plants, setPlants] = useState(demoPlants);
  const [expandedPlants, setExpandedPlants] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: string[]}>({});

  const togglePlant = (plantId: string) => {
    setExpandedPlants(current =>
      current.includes(plantId)
        ? current.filter(id => id !== plantId)
        : [...current, plantId]
    );
  };

  const toggleSection = (plantId: string, section: string) => {
    setExpandedSections(current => {
      const plantSections = current[plantId] || [];
      const newSections = plantSections.includes(section)
        ? plantSections.filter(s => s !== section)
        : [...plantSections, section];
      
      return {
        ...current,
        [plantId]: newSections
      };
    });
  };

  const handleAddComment = (plantId: string, commentText: string) => {
    setPlants(currentPlants => 
      currentPlants.map(plant => 
        plant.id === plantId
          ? {
              ...plant,
              comments: [
                ...plant.comments,
                {
                  id: uuidv4(),
                  text: commentText,
                  timestamp: new Date()
                }
              ]
            }
          : plant
      )
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <AggregatedEnergyChart plants={plants} />
      
      {plants.map((plant) => {
        const plantStatus = calculatePlantStatus(plant.meteringPoints);
        
        return (
          <div key={plant.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <Factory className="w-6 h-6 text-gray-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">{plant.name}</h2>
                  <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                    <StatusIndicator status={plantStatus} />
                    {plant.comments.length > 0 && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        <MessageSquare className="w-3 h-3" />
                        <span>{plant.comments.length} Kommentar{plant.comments.length !== 1 ? 'e' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => togglePlant(plant.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-4"
              >
                {expandedPlants.includes(plant.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            {expandedPlants.includes(plant.id) && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <ContactInfoPanel
                      contact={plant.contact}
                      comments={plant.comments}
                      onAddComment={(comment) => handleAddComment(plant.id, comment)}
                    />
                  </div>
                  <div className="col-span-2">
                    <MeteringPointsList
                      meteringPoints={plant.meteringPoints}
                      plantId={plant.id}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <EnergyCharts energyData={plant.energyData} />
                  <QuarterlyReportGrid
                    reports={plant.energyData.quarterlyReports || []}
                    onExport={(report) => {
                      console.log('Exporting report:', report);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-8">
        <EnergyContracts contracts={demoContracts} />
      </div>
    </div>
  );
};

export default EnergyProcurementDashboard;