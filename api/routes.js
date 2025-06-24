const { Router } = require('express');

const { caching } = require('./middlewares');
const SurahHandler = require('./handlers/surah');
const JuzHandler = require('./handlers/juz');

const router = Router();

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
  next();
});

router.get('/', (req, res) => res.status(200).send({
  surah: {
    listSurah: '/surah',
    spesificSurah: {
      pattern: '/surah/{surah}',
      example: '/surah/18'
    },
    spesificAyahInSurah: {
      pattern: '/surah/{surah}/{ayah}',
      example: '/surah/18/60'
    },
    spesificJuz: {
      pattern: '/juz/{juz}',
      example: '/juz/30'
    },
    tafseer: {
      pattern: '/tafseer/{tafseer_id}/{surah}/{ayah}',
      example: '/tafseer/1/1/1'
    }
  },
  maintaner: 'Sutan Gading Fadhillah Nasution <contact@gading.dev>',
  source: 'https://github.com/gadingnst/quran-api'
}));

router.get('/surah', caching, SurahHandler.getAllSurah);

router.get('/surah/:surah', caching, SurahHandler.getSurah);
router.get('/surah/:surah/:ayah', caching, SurahHandler.getAyahFromSurah);
router.get('/juz/:juz', caching, JuzHandler.getJuz);

router.get('/tafseer/:id/:surah/:ayah', caching, async(req, res) => {
  const { id, surah, ayah } = req.params;
  try {
    const response = await fetch(`${process.env.TAFSEER_API_BASE_URL}/${id}/${surah}/${ayah}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: 'Error',
      message: 'Failed to fetch tafseer data'
    });
  }
});

// fallback router
router.all('*', (req, res) => res.status(404).send({
  code: 404,
  status: 'Not Found.',
  message: `Resource "${req.url}" is not found.`
}));

module.exports = router;
