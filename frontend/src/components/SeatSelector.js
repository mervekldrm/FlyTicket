import React from 'react';

const Seat = ({ seatNumber, isOccupied, isSelected, onSelect }) => {
    const seatClass = isOccupied
        ? 'bg-red-500 cursor-not-allowed'
        : isSelected
        ? 'bg-green-500 text-white'
        : 'bg-gray-300 hover:bg-blue-400 cursor-pointer';

    return (
        <div
            className={`w-10 h-10 m-1 flex items-center justify-center rounded text-sm font-semibold ${seatClass}`}
            onClick={() => !isOccupied && onSelect(seatNumber)}
            title={isOccupied ? `Koltuk ${seatNumber} dolu` : `Koltuk ${seatNumber}`}
        >
            {seatNumber}
        </div>
    );
};

const SeatSelector = ({ totalSeats = 60, occupiedSeats = [], selectedSeat, onSeatSelect }) => {
    // Assuming a 3-3 layout for a typical narrow-body aircraft
    const seatsPerRow = 6;
    const numRows = Math.ceil(totalSeats / seatsPerRow);
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    const renderSeats = () => {
        let seats = [];
        for (let i = 0; i < numRows; i++) {
            let rowSeats = [];
            for (let j = 0; j < seatsPerRow; j++) {
                const seatNumber = `${i + 1}${seatLetters[j]}`;
                if ((i * seatsPerRow + j) < totalSeats) { // Only render actual seats up to totalSeats
                    rowSeats.push(
                        <Seat
                            key={seatNumber}
                            seatNumber={seatNumber}
                            isOccupied={occupiedSeats.includes(seatNumber)}
                            isSelected={selectedSeat === seatNumber}
                            onSelect={onSeatSelect}
                        />
                    );
                } else {
                    rowSeats.push(<div key={`empty-${i}-${j}`} className="w-10 h-10 m-1"></div>); // Empty placeholder
                }
            }
            seats.push(
                <div key={`row-${i}`} className="flex justify-center">
                    {rowSeats.slice(0, seatsPerRow / 2)}
                    <div className="w-8"></div> {/* Aisle space */}
                    {rowSeats.slice(seatsPerRow / 2)}
                </div>
            );
        }
        return seats;
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="text-lg font-semibold mb-3 text-center">Koltuk Seçimi</h4>
            <div className="flex flex-col items-center">
                {renderSeats()}
            </div>
            <div className="mt-4 flex justify-around text-xs">
                <div><span className="inline-block w-4 h-4 bg-gray-300 rounded mr-1"></span> Boş</div>
                <div><span className="inline-block w-4 h-4 bg-green-500 rounded mr-1"></span> Seçili</div>
                <div><span className="inline-block w-4 h-4 bg-red-500 rounded mr-1"></span> Dolu</div>
            </div>
        </div>
    );
};

export default SeatSelector;
