import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, WeekSelector, Section, MenuItem } from '../components';

export default function ChefMenu() {
  const { slug } = useParams();
  const [activeWeek, setActiveWeek] = useState('Cette semaine');

  const weeks = ['Cette semaine', 'Semaine dernière', 'Il y a 2 semaines'];

  // Mock data
  const menus = [
    { day: 'Lundi', midi: 'Riz sauce tomate', soir: 'Attiéké poisson' },
    { day: 'Mardi', midi: 'Pâtes bolognaise', soir: 'Fufu sauce graine' },
    { day: 'Mercredi', midi: 'Riz sauce arachide', soir: 'Pizza maison' },
    { day: 'Jeudi', midi: 'Couscous poulet', soir: 'Riz sauté légumes' },
    { day: 'Vendredi', midi: 'Poisson braisé + attiéké', soir: 'Spaghetti carbonara' },
    { day: 'Samedi', midi: 'Poulet rôti + frites', soir: 'Riz haricots' }
  ];

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Tous les menus" 
            subtitle="Consultez les menus de la semaine et des semaines précédentes"
          />

          <WeekSelector 
            weeks={weeks}
            activeWeek={activeWeek}
            onWeekChange={setActiveWeek}
          />

          {menus.map((menu) => (
            <Section key={menu.day} title={menu.day}>
              <MenuItem 
                title={menu.midi}
                description="Menu complet avec accompagnements"
                mealType="Midi"
              />
              <MenuItem 
                title={menu.soir}
                description="Menu complet avec accompagnements"
                mealType="Soir"
              />
            </Section>
          ))}
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
