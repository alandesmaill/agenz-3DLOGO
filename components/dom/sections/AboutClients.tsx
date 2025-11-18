'use client';

import { AppearByWords, AppearTitle } from '@/components/dom/animations';
import styles from '@/styles/sections/aboutClients.module.css';

const CLIENTS = [
  {
    year: '2024',
    name: 'Company Alpha',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    year: '2023',
    name: 'Company Beta',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    year: '2021',
    name: 'Company Gamma',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
];

export default function AboutClients() {
  return (
    <section className={styles.root}>
      <h1 className={styles.sectionTitle}>
        <AppearByWords>Clients</AppearByWords>
      </h1>

      <div className={styles.clientsGrid}>
        {CLIENTS.map((client, index) => (
          <div key={client.name} className={styles.clientCard}>
            <AppearTitle>
              <div className={styles.year}>{client.year}</div>
            </AppearTitle>

            <AppearTitle>
              <h4 className={styles.clientName}>{client.name}</h4>
            </AppearTitle>

            <AppearTitle>
              <p className={styles.description}>{client.description}</p>
            </AppearTitle>
          </div>
        ))}
      </div>
    </section>
  );
}
