import { motion } from 'motion/react';
import { useState } from 'react';
import CardRoom from '@/components/rooms/card-room';
import HeadingBlock from '@/components/typography/heading-block';
import { Button } from '@/components/ui/button';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import type { RoomItem } from '@/types/data';
import InfoBoxRoom from '@/components/rooms/info-box-room';

export default function RoomsIndex({ rooms }: { rooms: RoomItem[] }) {
    const [filter, setFilter] = useState<
        'all' | 'luxury' | 'standard' | 'cozy'
    >('all');

    const filteredRooms = rooms.filter((room) => {
        if (filter === 'all') {
            return true;
        }

        return room.type === filter;
    });

    return (
        <MainWrapper className="py-18">
            <HeadingBlock
                className="mx-auto text-center"
                badge={{ text: 'Our Sleep Accommodations' }}
                heading="Gorgeously Appointed Rooms"
                headingLevel={2}
                description={
                    <>
                        We offer {rooms.length} elegant country bedroom
                        {rooms.length !== 1 ? 's' : ''} accommodating up to{' '}
                        {rooms.reduce((sum, r) => sum + r.capacity, 0)} guests.
                        Every room has its own private flagstone entrance,
                        state-of-the-art climate control, loaded bar fridges,
                        and luxurious comfortable beds.
                    </>
                }
            />

            {/* Filter Tabs */}
            <div
                className="mb-12 flex flex-wrap justify-center gap-2.5"
                id="rooms-filter-controls"
            >
                {[
                    { label: 'All 8 Rooms', val: 'all' },
                    {
                        label: 'Luxury Suites (Free Bath + Shower)',
                        val: 'luxury',
                    },
                    {
                        label: 'Standard Kings (Private Verandah)',
                        val: 'standard',
                    },
                    { label: 'Cozy Queen (Pool Access)', val: 'cozy' },
                ].map((tab) => (
                    <Button
                        key={tab.val}
                        onClick={() => setFilter(tab.val as any)}
                        variant={filter === tab.val ? 'default' : 'outline'}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Rooms Grid */}
            <motion.div
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                id="rooms-card-grid"
            >
                {filteredRooms.map((room: RoomItem) => (
                    <motion.div key={room.id}>
                        <CardRoom room={room as RoomItem} />
                    </motion.div>
                ))}
            </motion.div>

            <InfoBoxRoom />
        </MainWrapper>
    );
}

RoomsIndex.displayName = 'RoomsIndex';

RoomsIndex.layout = MainLayout;
