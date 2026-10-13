import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Utensils, Moon, Cookie, Salad, Egg, Beef } from 'lucide-react';

const MEAL_PLANS = {
  veg: {
    breakfast: { title: 'Steel-cut oats and berries', desc: 'Topped with chia seeds, crushed almonds, and a touch of cinnamon to stabilize morning blood sugar.' },
    lunch: { title: 'Lentil and quinoa bowl with vegetables', desc: 'Steamed broccoli, spinach, and bell peppers served over sprouted brown rice with olive oil.' },
    snack: { title: 'Walnuts and roasted chickpeas', desc: 'High-protein, fiber-dense snack to curb afternoon glycemic dips.' },
    dinner: { title: 'Tofu and vegetable stir-fry', desc: 'Sauteed in sesame oil with bok choy, mushrooms, and zucchini with turmeric brown rice.' }
  },
  egg: {
    breakfast: { title: 'Boiled egg whites and avocado toast', desc: 'Two egg whites on whole grain rye bread with avocado mash and pumpkin seeds.' },
    lunch: { title: 'Spinach and egg omelet salad', desc: 'Double egg-white omelet with mushrooms and cherry tomatoes served over fresh arugula.' },
    snack: { title: 'Hard-boiled egg with paprika', desc: 'Quick protein boost paired with a cup of green tea.' },
    dinner: { title: 'Spiced lentil soup and egg scramble', desc: 'Warm mung bean soup with egg-white scramble and steamed green beans.' }
  },
  'non-veg': {
    breakfast: { title: 'Poached eggs and smoked salmon', desc: 'Paired with grilled asparagus and whole grain sourdough.' },
    lunch: { title: 'Grilled chicken breast and quinoa salad', desc: 'Seasoned with lemon, herbs, extra virgin olive oil, steamed zucchini, and bell peppers.' },
    snack: { title: 'Almonds and cucumber slices', desc: 'Hydrating, low-carb snack rich in healthy monounsaturated fats.' },
    dinner: { title: 'Baked omega-3 salmon and asparagus', desc: 'Wild-caught salmon fillet with roasted sweet potato wedges and steamed kale.' }
  }
};

export default function MealPlanCard({ activeDiet = 'veg', disease = 'General' }) {
  const plan = MEAL_PLANS[activeDiet] || MEAL_PLANS.veg;

  const mealItems = [
    { type: 'Breakfast', icon: <Coffee className="h-5 w-5 text-[var(--nc-warning)]" />, data: plan.breakfast },
    { type: 'Lunch', icon: <Utensils className="h-5 w-5 text-[var(--nc-green)]" />, data: plan.lunch },
    { type: 'Snack', icon: <Cookie className="h-5 w-5 text-[var(--nc-muted)]" />, data: plan.snack },
    { type: 'Dinner', icon: <Moon className="h-5 w-5 text-[var(--nc-info)]" />, data: plan.dinner },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-[var(--nc-ink)]" style={{ fontFamily: 'var(--nc-font-display)' }}>
            Suggested daily meals
            <span className="rounded-full border border-[var(--nc-line)] bg-[var(--nc-mint)] px-2.5 py-0.5 text-xs font-semibold capitalize text-[var(--nc-green-dark)]">
              {activeDiet === 'veg' ? 'Vegetarian' : activeDiet === 'egg' ? 'Eggetarian' : 'Non-Vegetarian'} focus
            </span>
          </h4>
          <p className="text-xs text-[var(--nc-muted)]">Structured nutrient-dense meals targeted at {disease.toLowerCase()} optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
        {mealItems.map((meal, idx) => (
          <motion.div
            key={meal.type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="flex flex-col justify-between rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-paper-warm)] p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--nc-muted-light)]">
                  {meal.icon}
                  {meal.type}
                </span>
              </div>
              <h5 className="mb-1 text-base font-bold text-[var(--nc-ink)]">{meal.data.title}</h5>
              <p className="text-xs leading-relaxed text-[var(--nc-muted)]">{meal.data.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}