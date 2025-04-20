import React, { useState } from 'react';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';

// Block data with their respective maps
const blocks = [
  {
    id: 'block-a',
    name: 'Block A',
    color: 'from-blue-500 to-blue-700',
    hoverColor: 'hover:from-blue-600 hover:to-blue-800',
    maps: [
      { id: 'a-ground', name: 'Ground Floor', image: '/images/block a ground floor.jpg' },
      { id: 'a-first', name: 'First Floor', image: '/images/block a first floor.jpg' },
      { id: 'a-second', name: 'Second Floor', image: '/images/block a second floor.jpg' },
      { id: 'a-third', name: 'Third Floor', image: '/images/block a first floor.jpg' }, // Using first floor as fallback
    ]
  },
  {
    id: 'block-b',
    name: 'Block B',
    color: 'from-green-500 to-green-700',
    hoverColor: 'hover:from-green-600 hover:to-green-800',
    maps: [
      { id: 'b-ground', name: 'Ground Floor', image: '/images/block b ground floor.jpg' },
      { id: 'b-first', name: 'First Floor', image: '/images/block b first floor.jpg' },
      { id: 'b-second', name: 'Second Floor', image: '/images/block b second floor.jpg' },
      { id: 'b-third', name: 'Third Floor', image: '/images/block b first floor.jpg' }, // Using first floor as fallback
    ]
  },
  {
    id: 'block-n',
    name: 'Block N',
    color: 'from-purple-500 to-purple-700',
    hoverColor: 'hover:from-purple-600 hover:to-purple-800',
    maps: [
      { id: 'n-ground', name: 'Ground Floor', image: '/images/block n ground floor.jpg' },
      { id: 'n-first', name: 'First Floor', image: '/images/block n first floor.jpg' },
      { id: 'n-second', name: 'Second Floor', image: '/images/block n first floor.jpg' }, // Using first floor as fallback
      { id: 'n-third', name: 'Third Floor', image: '/images/block n first floor.jpg' }, // Using first floor as fallback
    ]
  },
  {
    id: 'block-p',
    name: 'Block P',
    color: 'from-red-500 to-red-700',
    hoverColor: 'hover:from-red-600 hover:to-red-800',
    maps: [
      { id: 'p-ground', name: 'Ground Floor', image: '/images/block p ground floor.jpg' },
      { id: 'p-first', name: 'First Floor', image: '/images/block p ground floor.jpg' }, // Using ground floor as fallback
      { id: 'p-second', name: 'Second Floor', image: '/images/block p ground floor.jpg' }, // Using ground floor as fallback
      { id: 'p-third', name: 'Third Floor', image: '/images/block p ground floor.jpg' }, // Using ground floor as fallback
    ]
  }
];

export default function Maps() {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  
  // Handle block selection
  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
    setSelectedMap(block.maps[0]); // Default to first map when selecting a block
  };
  
  // Handle map selection
  const handleMapSelect = (map) => {
    setSelectedMap(map);
  };

  return (
    <PageWrapper direction="up">
      <Layout>
        <div className="flex flex-col items-center min-h-screen px-4 py-8">
          {/* Header */}
          <div className="w-full max-w-6xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-6 mb-8 text-white text-center">
            <h1 className="text-3xl lg:text-4xl font-bold">University Campus Maps</h1>
            <p className="text-lg mt-2">Navigate through our campus buildings and facilities</p>
          </div>
          
          {/* Main Content */}
          <div className="w-full max-w-6xl">
            {/* If no block selected, show block selection grid */}
            {!selectedBlock ? (
              <>
                <h2 className="text-2xl font-semibold text-center text-gray-300 mb-6">Select a Block</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blocks.map((block) => (
                    <motion.div
                      key={block.id}
                      className={`bg-gradient-to-r ${block.color} rounded-xl shadow-lg p-6 cursor-pointer transition-transform hover:scale-105 ${block.hoverColor}`}
                      whileHover={{ y: -5 }}
                      onClick={() => handleBlockSelect(block)}
                    >
                      <h3 className="text-xl font-bold text-white">{block.name}</h3>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              // If block is selected, show maps for that block
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-300">{selectedBlock.name} Maps</h2>
                  <button
                    onClick={() => {
                      setSelectedBlock(null);
                      setSelectedMap(null);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                  >
                    Back to Blocks
                  </button>
                </div>
                
                {/* Floor selection tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBlock.maps.map((map) => (
                    <button
                      key={map.id}
                      onClick={() => handleMapSelect(map)}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedMap && selectedMap.id === map.id
                          ? `bg-gradient-to-r ${selectedBlock.color} text-white`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {map.name}
                    </button>
                  ))}
                </div>
                
                {/* Map display */}
                {selectedMap && (
                  <div className="bg-gray-800 p-4 rounded-xl shadow-inner">
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <img
                        src={selectedMap.image}
                        alt={`${selectedBlock.name} - ${selectedMap.name}`}
                        className="rounded-lg object-cover w-full shadow-lg"
                      />
                      
                      {/* Map overlay with caption */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">
                          {selectedBlock.name} - {selectedMap.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </PageWrapper>
  );
}