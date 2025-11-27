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
  
  const menusParSemaine: any = {
    'Cette semaine': [
      { day: 'Lundi', midi: 'Riz sauce tomate', soir: 'Attiéké poisson' },
      { day: 'Mardi', midi: 'Pâtes bolognaise', soir: 'Fufu sauce graine' },
      { day: 'Mercredi', midi: 'Riz sauce arachide', soir: 'Pizza maison' },
      { day: 'Jeudi', midi: 'Couscous poulet', soir: 'Riz sauté légumes' },
      { day: 'Vendredi', midi: 'Poisson braisé + attiéké', soir: 'Spaghetti carbonara' },
      { day: 'Samedi', midi: 'Poulet rôti + frites', soir: 'Riz haricots' }
    ],
    'Semaine dernière': [
      { day: 'Lundi', midi: 'Fufu sauce gombo', soir: 'Riz gras' },
      { day: 'Mardi', midi: 'Attiéké sauce arachide', soir: 'Pâtes sauce tomate' },
      { day: 'Mercredi', midi: 'Riz haricots', soir: 'Poisson braisé' },
      { day: 'Jeudi', midi: 'Pizza maison', soir: 'Couscous légumes' },
      { day: 'Vendredi', midi: 'Riz sauté', soir: 'Fufu sauce graine' },
      { day: 'Samedi', midi: 'Attiéké poisson', soir: 'Spaghetti bolognaise' }
    ],
    'Il y a 2 semaines': [
      { day: 'Lundi', midi: 'Pâtes carbonara', soir: 'Riz sauce arachide' },
      { day: 'Mardi', midi: 'Poulet rôti + frites', soir: 'Attiéké poisson' },
      { day: 'Mercredi', midi: 'Fufu sauce graine', soir: 'Pizza maison' },
      { day: 'Jeudi', midi: 'Riz gras', soir: 'Poisson braisé' },
      { day: 'Vendredi', midi: 'Couscous poulet', soir: 'Pâtes sauce tomate' },
      { day: 'Samedi', midi: 'Attiéké sauce gombo', soir: 'Riz haricots' }
    ]
  };

  const menus = menusParSemaine[activeWeek];

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
          
          {menus.map((menu: any) => (
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
