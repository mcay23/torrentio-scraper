const Providers = {
  key: 'providers',
  options: [
    {
      key: 'yts',
      label: 'YTS'
    },
    {
      key: 'eztv',
      label: 'EZTV'
    },
    {
      key: 'rarbg',
      label: 'RARBG'
    },
    {
      key: '1337x',
      label: '1337x'
    },
    {
      key: 'thepiratebay',
      label: 'ThePirateBay'
    },
    {
      key: 'kickasstorrents',
      label: 'KickassTorrents'
    },
    {
      key: 'torrentgalaxy',
      label: 'TorrentGalaxy'
    },
    {
      key: 'horriblesubs',
      label: 'HorribleSubs',
      anime: true
    },
    {
      key: 'nyaasi',
      label: 'NyaaSi',
      anime: true
    },
    {
      key: 'nyaapantsu',
      label: 'NyaaPantsu',
      anime: true
    },
    {
      key: 'rutor',
      label: 'Rutor',
      foreign: '🇷🇺'
    },
    {
      key: 'comando',
      label: 'Comando',
      foreign: '🇵🇹'
    },
    {
      key: 'comoeubaixo',
      label: 'ComoEuBaixo',
      foreign: '🇵🇹'
    },
    {
      key: 'lapumia',
      label: 'Lapumia',
      foreign: '🇵🇹'
    },
    {
      key: 'ondebaixa',
      label: 'OndeBaixa',
      foreign: '🇵🇹'
    },
    {
      key: 'torrent9',
      label: 'Torrent9',
      foreign: '🇫🇷'
    }
  ]
};
const QualityFilter = {
  key: 'qualityfilter',
  options: [
    {
      key: '4k',
      label: '4k',
      items: ['4k', '4k HDR'],
      test(quality) {
        return this.items.includes(quality);
      }
    },
    {
      key: '1080p',
      label: '1080p',
      items: ['1080p'],
      test(quality) {
        return this.items.includes(quality)
      }
    },
    {
      key: '720p',
      label: '720p',
      items: ['720p'],
      test(quality) {
        return this.items.includes(quality)
      }
    },
    {
      key: '480p',
      label: '480p',
      items: ['480p'],
      test(quality) {
        return this.items.includes(quality)
      }
    },
    {
      key: 'other',
      label: 'Other (DVDRip/HDRip/BDRip...)',
      // could be ['DVDRip', 'HDRip', 'BDRip', 'BRRip', 'BluRay', 'WEB-DL', 'WEBRip', 'HDTV', 'DivX', 'XviD']
      items: ['4k', '4k HDR', '1080p', '720p', '480p', 'SCR', 'CAM', 'TeleSync', 'TeleCine'],
      test(quality) {
        return quality && !this.items.includes(quality);
      }
    },
    {
      key: 'scr',
      label: 'Screener',
      items: ['SCR'],
      test(quality) {
        return this.items.includes(quality)
      }
    },
    {
      key: 'cam',
      label: 'Cam',
      items: ['CAM', 'TeleSync', 'TeleCine'],
      test(quality) {
        return this.items.includes(quality)
      }
    },
    {
      key: 'unknown',
      label: 'Unknown',
      test(quality) {
        return !quality
      }
    }
  ]
};
const defaultProviderKeys = Providers.options.map(provider => provider.key);

function applyFilters(streams, config) {
  return filterByQuality(filterByProvider(streams, config), config);
}

function filterByProvider(streams, config) {
  const providers = config.providers || defaultProviderKeys;
  if (!providers || !providers.length) {
    return streams;
  }
  return streams.filter(stream => {
    const match = stream.title.match(/⚙.* ([^ \n]+)/);
    const provider = match && match[1].toLowerCase();
    return providers.includes(provider);
  })
}

function filterByQuality(streams, config) {
  const filters = config[QualityFilter.key];
  if (!filters) {
    return streams;
  }
  const filterOptions = QualityFilter.options.filter(option => filters.includes(option.key));
  return streams.filter(stream => {
    const streamQuality = stream.name.split('\n')[1];
    return !filterOptions.some(option => option.test(streamQuality));
  });
}

module.exports = applyFilters;
module.exports.Providers = Providers;
module.exports.QualityFilter = QualityFilter;