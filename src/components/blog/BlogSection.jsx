// Clean Blog Section Component for RunningTrainingApp.jsx
// Replace the corrupted blog section with this clean implementation

const BlogSection = ({ colors, onReadArticle }) => {
  const featuredArticles = getFeaturedArticles();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold" style={{ color: colors.black }}>
          Running Insights & Articles
        </h2>
        <p className="text-xl" style={{ color: colors.darkGreen }}>
          Evidence-based training articles and VDOT insights from professional coaches
        </p>
      </div>

      {/* Featured Articles */}
      <div className="munich-card">
        <div className="munich-card-header">
          <h3 className="text-2xl font-bold" style={{ color: colors.black }}>
            Featured Articles
          </h3>
        </div>
        <div className="munich-card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <ArticleCard 
                key={article.id}
                article={article}
                colors={colors}
                onReadArticle={onReadArticle}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="munich-card" style={{ 
        background: `linear-gradient(135deg, ${colors.lightBlue}15, ${colors.lightGreen}15)` 
      }}>
        <div className="munich-card-body text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: colors.black }}>
            Get Weekly Training Insights
          </h3>
          <p className="text-lg mb-6" style={{ color: colors.darkGreen }}>
            Join 5,000+ runners receiving evidence-based training tips, race strategies, and VDOT insights.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-3 border-2 rounded focus:outline-none"
              style={{ borderColor: colors.gray }}
            />
            <button className="munich-btn munich-btn-primary px-6">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Replace the blog section around line 2520 with:
// {activeTab === 'blog' && <BlogSection colors={colors} onReadArticle={setSelectedArticle} />}
