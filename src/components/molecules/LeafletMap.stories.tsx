import type { Meta, StoryObj } from '@storybook/react'
import { LeafletMap } from './LeafletMap'
import { DEFAULT_MAP_LAYERS } from '@/types'
import { parseGpx } from '@/lib/gpx'

const DEMO_FEATURE_LAYERS = [
  {
    type: 'stuga',
    label: 'Stugor',
    icon: '🏡',
    color: '#2C4A3E',
    markers: [
      { id: 'stuga-1', position: { lat: 68.35, lng: 18.82 }, type: 'stuga', label: 'Abisko fjällstation', description: 'STF-anläggning vid Abisko nationalpark' },
      { id: 'stuga-2', position: { lat: 67.9, lng: 18.5 }, type: 'stuga', label: 'Kebnekaise fjällstation', description: 'Bas för Kebnekaisebestigningar' },
      { id: 'stuga-3', position: { lat: 63.42, lng: 13.08 }, type: 'stuga', label: 'Storulvån fjällstation' },
    ],
  },
  {
    type: 'eldplats',
    label: 'Eldplatser',
    icon: '🔥',
    color: '#D97B4F',
    markers: [
      { id: 'eld-1', position: { lat: 59.85, lng: 18.32 }, type: 'eldplats', label: 'Grisslehamn eldplats', description: 'Eldplats med ved och bord' },
      { id: 'eld-2', position: { lat: 58.6, lng: 16.18 }, type: 'eldplats', label: 'Tiveden rastplats' },
    ],
  },
  {
    type: 'badplats',
    label: 'Badplatser',
    icon: '🏊',
    color: '#A8C4D4',
    markers: [
      { id: 'bad-1', position: { lat: 56.04, lng: 12.69 }, type: 'badplats', label: 'Mölle badplats', description: 'Naturlig havsbadplats i Kullaberg' },
      { id: 'bad-2', position: { lat: 58.28, lng: 11.44 }, type: 'badplats', label: 'Smögen havsbad' },
    ],
  },
]

/** A winding hiking track near Kebnekaise for demo purposes */
const DEMO_TRACK = [
  { lat: 67.88, lng: 18.48 },
  { lat: 67.885, lng: 18.485 },
  { lat: 67.89, lng: 18.49 },
  { lat: 67.895, lng: 18.495 },
  { lat: 67.898, lng: 18.5 },
  { lat: 67.902, lng: 18.505 },
  { lat: 67.905, lng: 18.51 },
  { lat: 67.908, lng: 18.515 },
  { lat: 67.91, lng: 18.52 },
  { lat: 67.912, lng: 18.525 },
  { lat: 67.915, lng: 18.53 },
  { lat: 67.918, lng: 18.528 },
  { lat: 67.92, lng: 18.525 },
  { lat: 67.922, lng: 18.522 },
  { lat: 67.925, lng: 18.52 },
]

const meta = {
  title: 'Molecules/LeafletMap',
  component: LeafletMap,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof LeafletMap>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    height: '500px',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

export const CenteredOnLocation: Story = {
  name: 'Centered on Location',
  args: {
    center: { lat: 68.35, lng: 18.82 },
    zoom: 11,
    height: '500px',
    'aria-label': 'Karta över Abiskoområdet',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

export const WithMarkers: Story = {
  name: 'With Feature Layers',
  args: {
    center: { lat: 63, lng: 15 },
    zoom: 5,
    height: '600px',
    featureLayers: DEMO_FEATURE_LAYERS,
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

export const FilteredMarkers: Story = {
  name: 'With Filtered Layers (only stugor)',
  args: {
    center: { lat: 65, lng: 16 },
    zoom: 5,
    height: '600px',
    featureLayers: DEMO_FEATURE_LAYERS,
    activeFeatureTypes: ['stuga'],
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

export const TopoLayer: Story = {
  name: 'Topographic Layer',
  args: {
    center: { lat: 68.35, lng: 18.82 },
    zoom: 12,
    activeLayerId: 'topo',
    height: '500px',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

export const SingleLayer: Story = {
  name: 'Single Layer (no toggle)',
  args: {
    center: { lat: 59.33, lng: 18.07 },
    zoom: 11,
    layers: [DEFAULT_MAP_LAYERS[0]],
    height: '400px',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

export const CompactSidebar: Story = {
  name: 'Compact (sidebar use case)',
  args: {
    center: { lat: 67.9, lng: 18.5 },
    zoom: 13,
    height: '220px',
    featureLayers: [
      {
        type: 'stuga',
        label: 'Stuga',
        color: '#2C4A3E',
        markers: [{ id: '1', position: { lat: 67.9, lng: 18.5 }, type: 'stuga', label: 'Kebnekaise fjällstation' }],
      },
    ],
    'aria-label': 'Karta för Kebnekaise fjällstation',
  },
  decorators: [(Story) => <div className="w-[360px]"><Story /></div>],
}

export const FullscreenToggle: Story = {
  name: 'Fullscreen Toggle (click to expand)',
  args: {
    center: { lat: 63, lng: 15 },
    zoom: 5,
    height: '400px',
    featureLayers: DEMO_FEATURE_LAYERS,
    showFullscreenToggle: true,
    'aria-label': 'Karta med helskärmsläge',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        story: 'Click the expand icon (top-left) to go fullscreen. Press Escape or click the minimize icon to exit.',
      },
    },
  },
}

export const NoFullscreenToggle: Story = {
  name: 'No Fullscreen Toggle',
  args: {
    center: { lat: 59.33, lng: 18.07 },
    zoom: 11,
    height: '400px',
    showFullscreenToggle: false,
    'aria-label': 'Karta utan helskärmsknapp',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

// ─── Track stories ───────────────────────────────────────────────────────────

export const WithTrack: Story = {
  name: 'With Track (polyline)',
  args: {
    activeLayerId: 'topo',
    height: '500px',
    tracks: [DEMO_TRACK],
    'aria-label': 'Karta med vandringsled',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

export const WithTrackAndMarkers: Story = {
  name: 'With Track and Markers',
  args: {
    activeLayerId: 'topo',
    height: '500px',
    tracks: [DEMO_TRACK],
    featureLayers: [
      {
        type: 'start',
        label: 'Start',
        color: '#2C4A3E',
        markers: [
          {
            id: 'start-1',
            position: { lat: 67.88, lng: 18.48 },
            type: 'start',
            label: 'Kebnekaise fjällstation',
            description: 'Startpunkt för vandringen',
          },
        ],
      },
    ],
    'aria-label': 'Karta med vandringsled och startpunkt',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
}

export const CompactWithTrack: Story = {
  name: 'Compact With Track (sidebar)',
  args: {
    activeLayerId: 'topo',
    height: '220px',
    tracks: [DEMO_TRACK],
    featureLayers: [
      {
        type: 'start',
        label: 'Start',
        color: '#2C4A3E',
        markers: [
          {
            id: 'start-1',
            position: { lat: 67.88, lng: 18.48 },
            type: 'start',
            label: 'Kebnekaise fjällstation',
          },
        ],
      },
    ],
    'aria-label': 'Kompakt karta med vandringsled',
  },
  decorators: [(Story) => <div className="w-[360px]"><Story /></div>],
}

export const TrackBoundsFallback: Story = {
  name: 'Track Bounds Override Center/Zoom',
  args: {
    center: { lat: 59.33, lng: 18.07 },
    zoom: 5,
    activeLayerId: 'topo',
    height: '500px',
    tracks: [DEMO_TRACK],
    'aria-label': 'Karta där ledens gränser åsidosätter centrum/zoom',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        story: 'The map should fit to the track bounds, ignoring the explicit center (Stockholm) and zoom (5).',
      },
    },
  },
}

export const ParsedGpxTrack: Story = {
  name: 'Parsed GPX Track (integration)',
  args: {
    activeLayerId: 'topo',
    height: '500px',
    tracks: [
      parseGpx(`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Demo">
  <trk>
    <trkseg>
      <trkpt lat="67.8800" lon="18.4800"></trkpt>
      <trkpt lat="67.8900" lon="18.4900"></trkpt>
      <trkpt lat="67.8980" lon="18.5000"></trkpt>
      <trkpt lat="67.9050" lon="18.5100"></trkpt>
      <trkpt lat="67.9100" lon="18.5200"></trkpt>
      <trkpt lat="67.9150" lon="18.5300"></trkpt>
      <trkpt lat="67.9200" lon="18.5250"></trkpt>
      <trkpt lat="67.9250" lon="18.5200"></trkpt>
    </trkseg>
  </trk>
</gpx>`),
    ],
    'aria-label': 'Karta med GPX-parsad led',
  },
  decorators: [(Story) => <div className="w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates end-to-end GPX parsing: raw XML → parseGpx() → LeafletMap tracks prop.',
      },
    },
  },
}
