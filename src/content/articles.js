// Blog articles content - separated from UI components
export const articles = [
  {
    id: 'vdot-limitations',
    category: 'TRAINING SCIENCE',
    title: 'Why Your Running Paces Don\'t Match VDOT Charts',
    excerpt: 'Discover the individual factors that VDOT completely ignores and how they affect your training paces. Learn why many runners struggle with Daniels\' recommendations.',
    readTime: '5 min read',
    sources: [
      {
        title: 'Daniels, J. — Daniels’ Running Formula (book)',
        details: 'Human Kinetics. Source for VDOT concepts and training pace zone framework.'
      },
      {
        title: 'Riegel, P. S. — Athletic Records and Human Endurance',
        details: 'American Scientist (1981). Source for the race-time prediction approach commonly referred to as the “Riegel formula”.'
      }
    ],
    content: `
# Why Your Running Paces Don't Match VDOT Charts

*Individual factors that affect running performance beyond just VO2max*

---

You calculated your VDOT. You printed out Jack Daniels' training pace chart. You laced up your shoes for that first tempo run, confident in the science.

**Then reality hit.**

The paces felt wrong. Too fast for some workouts, too slow for others. Your legs screamed during "easy" runs, while your supposedly challenging threshold pace felt like a jog.

Sound familiar? You're not broken, and neither is VDOT. But there's a critical gap between laboratory-perfect formulas and the beautifully messy reality of individual runners.

## The VDOT Promise vs. Reality

Dr. Jack Daniels' VDOT system revolutionized training by connecting race performance to VO2max equivalents. The promise was elegant: run a time trial, plug it into the formula, and get perfectly calibrated training paces.

**The science is sound.** VDOT correlates strongly with racing success across distances.

**The problem is application.** VDOT assumes all runners are identical except for their VO2max. In reality, individual factors create massive variations in how VDOT translates to sustainable training paces.

## The Missing Variables

### Age and Experience
A 25-year-old first-year runner and a 45-year-old with two decades of training history might have identical VDOT values. Their training paces? Completely different.

**Research shows:** Older runners typically require slower easy paces relative to their race pace, while beginners often need faster threshold work relative to their VO2max efforts.¹

### Recovery Capacity
VDOT can't measure how quickly you bounce back from hard efforts. Elite athletes might hit VDOT paces day after day. Weekend warriors might need 48-72 hours between quality sessions.

**The disconnect:** VDOT prescribes pace zones without accounting for the recovery time needed between efforts at those intensities.

### Running Economy and Biomechanics
Two runners with identical VO2max can have vastly different running economies—how efficiently they use oxygen at any given pace.

**Real impact:** Runner A might cruise at VDOT easy pace, while Runner B struggles with the same effort at 30 seconds per mile slower.

### Heat and Altitude
VDOT calculations assume sea level, 60°F conditions. Training in Phoenix summer or Colorado mountains? Those pace zones become theoretical.

### Training History
A cyclist-turned-runner might have the cardiovascular fitness for aggressive VDOT paces but lack the musculoskeletal adaptation for the pounding. Their "easy" pace might need to be minutes slower than VDOT suggests.

## When VDOT Works (And When It Doesn't)

**VDOT excels for:**
- Goal race pace prediction
- General intensity zone structure
- Tracking fitness improvements over time

**VDOT struggles with:**
- Day-to-day training pace prescription
- Individual recovery needs
- Environmental adjustments
- Biomechanical limitations

## The Personalized Alternative

Modern training moves beyond one-size-fits-all pace charts. The best coaches use VDOT as a starting point, then adjust based on:

1. **Perceived effort scales**
2. **Heart rate zones**
3. **Individual response to training loads**
4. **Environmental factors**
5. **Life stress and recovery markers**

## The Bottom Line

VDOT isn't wrong—it's incomplete. Use it to understand your potential and structure your training. But don't let it override what your body is telling you.

**Your perfect training pace isn't in a chart.** It's in the intersection of science and self-awareness, data and intuition, VDOT and your individual reality.

---

**Sources:**
1. Daniels, J. *Daniels’ Running Formula*. Human Kinetics.
2. Riegel, P. S. "Athletic Records and Human Endurance." *American Scientist*, 1981.
    `,
    featured: true
  },
  
  {
    id: 'individual-factors',
    category: 'PERSONALIZATION',
    title: 'The Individual Factors VDOT Completely Ignores',
    excerpt: 'Age, experience, biomechanics, and recovery capacity all affect your training paces. Here\'s how to account for what makes you unique.',
    readTime: '7 min read',
    sources: [
      {
        title: 'Daniels, J. — Daniels’ Running Formula (book)',
        details: 'Human Kinetics. Baseline methodology reference for pace zones and adaptation principles.'
      }
    ],
    content: `
# The Individual Factors VDOT Completely Ignores

*A deep dive into the personal variables that affect your training*

---

## Coming Soon

This comprehensive guide will cover:
- Age-adjusted pace modifications
- Experience level considerations  
- Biomechanical efficiency factors
- Recovery capacity assessment
- Environmental adaptations

*This article is currently being developed. Check back soon!*
    `,
    featured: false
  },
  
  {
    id: 'goldenpace-success',
    category: 'SUCCESS STORIES',
    title: 'How GoldenPace Training Broke My 5K Plateau',
    excerpt: 'After two years stuck at 22 minutes, individualized pacing helped me break through to sub-20. Here\'s how personal factors made the difference.',
    readTime: '4 min read',
    sources: [
      {
        title: 'Daniels, J. — Daniels’ Running Formula (book)',
        details: 'Human Kinetics. Reference framework for training intensities.'
      }
    ],
    content: `
# How GoldenPace Training Broke My 5K Plateau

*A runner's journey from generic training to personalized success*

---

## Coming Soon

This case study will detail:
- The 2-year plateau at 22-minute 5K
- Traditional VDOT limitations discovered
- GoldenPace individualization process
- Training adjustments that worked
- Race day breakthrough to sub-20

*This success story is currently being developed. Check back soon!*
    `,
    featured: false
  }
];

export const getArticleById = (id) => {
  return articles.find(article => article.id === id);
};

export const getFeaturedArticles = () => {
  return articles.filter(article => article.featured);
};

export const getArticlesByCategory = (category) => {
  return articles.filter(article => article.category === category);
};
