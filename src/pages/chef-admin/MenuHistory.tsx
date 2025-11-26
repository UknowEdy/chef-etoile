import { useState } from 'react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, WeekSelector, Section } from '../../components';

export default function ChefAdminMenuHistory() {
  const [activeWeek, setActiveWeek] = useState('Semaine dernière');
  const weeks = ['Semaine dernière', 'Il y a 2 semaines', 'Il y a 3 semaines'];

  return (
    <AppShell>
      <TopBar title="Historique des menus" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle title="Historique" subtitle="Consultez vos anciens menus" />
          <WeekSelector 
            weeks={weeks}
            activeWeek={activeWeek}
            onWeekChange={setActiveWeek}
          />
          <Section>
            <div className="card">
              <div style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>
                Menus de la {activeWeek.toLowerCase()}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
