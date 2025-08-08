import React from 'react';

const ArticleCard = ({ article, colors, onReadArticle }) => {
  const getGeometricShape = (index) => {
    const shapes = ['geometric-diamond', 'geometric-octagon', 'geometric-square'];
    return shapes[index % shapes.length];
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'TRAINING SCIENCE': return colors.lightBlue;
      case 'PERSONALIZATION': return colors.lightGreen;
      case 'SUCCESS STORIES': return colors.violet;
      case 'NUTRITION': return colors.orange;
      case 'RACE STRATEGY': return colors.yellow;
      default: return colors.lightBlue;
    }
  };

  return (
    <div className="munich-card relative overflow-hidden group">
      <div className={`absolute top-2 right-2 w-6 h-6 ${getGeometricShape(0)}`} style={{ 
        backgroundColor: getCategoryColor(article.category),
        opacity: 0.7
      }}></div>
      
      <div className="munich-card-body">
        <div className="mb-4">
          <span className="text-xs font-medium px-3 py-1" style={{ 
            backgroundColor: getCategoryColor(article.category),
            color: colors.white 
          }}>
            {article.category}
          </span>
        </div>
        
        <h4 className="text-lg font-bold mb-3" style={{ color: colors.black }}>
          {article.title}
        </h4>
        
        <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: colors.silver }}>
            {article.readTime}
          </span>
          <button 
            onClick={() => onReadArticle(article)}
            className="munich-btn munich-btn-outline text-xs px-3 py-1"
          >
            Read Article
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
