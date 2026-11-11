
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Droplets,
  GitCompare,
  Images,
  Layers,
  PaintBucket,
  Save,
  Upload,
  Wand2,
} from 'lucide-react';

import { Logo } from '../App';
import { SAMPLES } from '../data/sampleProjects';
import { Thumb } from '../components/ProjectCard';

const F = [
  [Wand2, 'Smart Wall Selection', 'Paint over any wall with an adjustable brush and eraser.'],
  [PaintBucket, 'Color Visualization', '22 curated colors plus any custom HEX value.'],
  [Layers, 'Texture & Finish', 'Six finishes and eight patterns rendered on your wall.'],
  [GitCompare, 'Before / After', 'Drag a slider or view both versions side by side.'],
  [Images, 'Design Library', 'Colors, finishes, patterns and lighting in one place.'],
  [Save, 'Project Saving', 'Projects stay on your device and reopen exactly as left.'],
  [Download, 'Export Designs', 'Download your visualization as a PNG.'],
];

function HeroTile({ src, label, alt, side }) {
  const [ok, setOk] = useState(true);

  return (
    <figure className="group relative aspect-[4/3] overflow-hidden bg-stone-200 dark:bg-stone-700 md:aspect-auto">
      {ok && (
        <img
          src={src}
          alt={alt}
          width="800"
          height="1000"
          decoding="async"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      )}

      {!ok && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-stone-500">
          Image could not be loaded
        </div>
      )}

      <figcaption
        className={`absolute top-4 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[.2em] text-stone-800 backdrop-blur ${
          side === 'l' ? 'left-4' : 'right-4'
        }`}
      >
        {label}
      </figcaption>
    </figure>
  );
}

function HeroVisual() {
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl bg-white/70 shadow-xl md:aspect-[4/3] md:grid-cols-2">
      <HeroTile
        side="l"
        label="Before"
        src="/images/hero-before.jpeg"
        alt="Living room before wall renovation"
      />

      <HeroTile
        side="r"
        label="After"
        src="/images/hero-after.jpeg"
        alt="Living room after wall renovation"
      />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="fade">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between p-5">
        <Logo />

        <nav className="flex gap-4 text-sm" aria-label="Site">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-medium leading-tight md:text-6xl">
            Visualize Your Walls. Before You Paint.
          </h1>

          <p className="mt-5 max-w-md text-lg text-stone-600 dark:text-stone-300">
            Preview colors, finishes and wall designs directly on your own
            room photographs, then save and export your favourites.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/visualizer" className="btn-p px-6 py-3">
              Start Visualizing
            </Link>

            <Link to="/projects" className="btn-s px-6 py-3">
              Explore Projects
            </Link>
          </div>
        </div>

        <HeroVisual />
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-3xl">How it works</h2>

        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [Upload, 'Upload your room', 'Drop in a JPG, PNG or WEBP photo.'],
            [Wand2, 'Customize your wall', 'Paint the wall area, then pick a color, finish and pattern.'],
            [Save, 'Visualize & save', 'Compare before and after, save, and export.'],
          ].map(([I, t, d], i) => (
            <li key={t} className="card p-6">
              <I className="mb-3" />
              <h3 className="text-xl">
                {i + 1}. {t}
              </h3>
              <p className="mt-1 text-sm text-stone-500">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-3xl">Features</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {F.map(([I, t, d]) => (
            <div key={t} className="card p-5">
              <I size={20} className="mb-2" />
              <h3 className="text-lg">{t}</h3>
              <p className="text-sm text-stone-500">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-3xl">Showcase</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLES.map((p) => (
            <figure
              key={p.id}
              className="group overflow-hidden rounded-2xl border"
            >
              <Thumb p={p} className="aspect-[4/3] w-full" />

              <figcaption className="flex items-center gap-2 p-3 text-sm">
                <Droplets size={14} />
                {p.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="mx-auto my-12 max-w-4xl rounded-3xl bg-stone-900 p-12 text-center text-white">
        <h2 className="text-4xl">
          Ready to transform your space?
        </h2>

        <Link
          to="/visualizer"
          className="btn mt-6 bg-white px-6 py-3 text-stone-900 hover:bg-stone-200"
        >
          Create Your First Visualization
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t p-5 text-sm text-stone-500">
        <div>
          <strong className="font-serif tracking-[.2em] text-stone-900 dark:text-stone-100">
            WALLORA
          </strong>

          <p>Visualize Your Walls. Before You Paint.</p>
        </div>

        <nav className="flex gap-4" aria-label="Footer">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/visualizer">Visualizer</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </footer>
    </div>
  );
}
