#!/usr/bin/env node

/*
 * Prints a given message to console if env.debug is set.
 *
 * @param m Debugging message
 */
function debug(m) {
  if (env.debug)
    console.log('debug: ' + m);
}

/*
 * Prints a given error message to console and quits. Note this function does
 * not return.
 *
 * @param m Error message
 */
function fatal(m) {
  console.log('fatal: ' + m);
  process.exit(1);
}

function usage() {
  console.log('Usage: png\n' +
              '           -o --output [file]     Output to file\n' +
              '           -f --format [format]   Output format\n' +
              '           -c --conf [file]       Use configuration file\n' +
              '           -p --payload [file]    Use payload file\n' +
              '           -s --size [number]     Number of records to generate');
}

/*
 * A tuple object.
 *
 * @param isHeader 1 for header tuple, else 0
 */
function Tuple(isHeader) {

  /* Return boolean true with probability (chance * 100)% */
  function r(chance) {
    return Math.random() < chance;
  }

  /* Return random entry from array */
  function rentry(array) {
    return env.payload[array][Math.floor(Math.random() * (array.length + 1))];
  }

  /* Return random integer in range low to high */
  function rint(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

  /* Generate a random string of length characters */
  function rstring(length) {
    var string = '';
    var space = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '01234567890';

    for (var i = 0; i < length; i++)
      string += space.charAt(rint(0, space.length));

    return string;
  }

  /* Generate a random E.C. string */
  function rec() {
    return (rint(1, 3) + '.' +
            rint(1, 10) + '.' +
            rint(1, 20) + '.' +
            rint(1, 120));
  }

  /* Generate a random Latin binomial */
  function rbinomial() {
    var genus = rentry('latin');
    var species = rentry('latin');

    return genus + ' ' + species;
  }

  /* Generate a random molecular weight */
  function rmw() {
    return rint(23, 150) * 1000;
  }

  /* Generate a random isoelectric point */
  function rpi() {
    return (Math.random() * 14).toFixed(2);
  }

  if (isHeader) {
    /* Generate header titles */
    this.p = {
      'dataset' : 'Dataset',
      'ec' : 'E.C.',
      'protein' : 'Protein',
      'alt' : 'Alternative name(s)',
      'source' : 'Source',
      'organ' : 'Organ',
      'mw' : 'M.W',
      'subno' : 'Subunut No.',
      'submw' : 'Subunut M.W',
      'isoenzymes' : 'No. of Iso-enzymes',
      'piMax' : 'pI Maximum',
      'piRangeMin' : 'pI Range min',
      'piRangeMax' : 'pI Range max',
      'piMajor' : 'pI value of major component',
      'pi' : 'pI',
      'temp' : 'Temperature',
      'method' : 'Method',
      'valid' : 'Valid sequence(s) available',
      'sequence' : 'Protein Sequence',
      'species' : 'Species Taxonomy',
      'full' : 'Full Text',
      'abstract' : 'Abstract',
      'pubmed' : 'PubMed',
      'notes' : 'Notes'
    };

  } else {

    this.p = {
      'dataset' : '',
      'ec' : '',
      'protein' : '',
      'alt' : '',
      'source' : '',
      'organ' : '',
      'mw' : '',
      'subno' : '',
      'submw' : '',
      'isoenzymes' : '',
      'piMax' : '',
      'piRangeMin' : '',
      'piRangeMax' : '',
      'piMajor' : '',
      'pi' : '',
      'temp' : '',
      'method' : '',
      'valid' : '',
      'sequence' : '',
      'species' : '',
      'full' : '',
      'abstract' : '',
      'pubmed' : '',
      'notes' : ''
    };

    if (r(env.dataset.dataset.populated))
      this.p['dataset'] = rentry('datasets');
    if (r(env.dataset.ec.populated))
      this.p['ec'] = rec();
    if (r(env.dataset.protein.populated))
      this.p['protein'] = rentry('proteins');
    if (r(env.dataset.alt.populated))
      this.p['alt'] = rentry('proteins');
    if (r(env.dataset.source.populated))
      this.p['source'] = rbinomial();
    if (r(env.dataset.organ.populated))
      this.p['organ'] = rentry('organs');
    if (r(env.dataset.mw.populated))
      this.p['mw'] = rmw();

    if (r(env.dataset.subunit.populated)) {
      if (r(env.dataset.subunit.no.populated))
        this.p['subno'] = rint(1, 148);
      if (r(env.dataset.subunit.mw.populated))
        this.p['submw'] = rmw();
    }

    if (r(env.dataset.isoenzymes.populated))
      this.p['isoenzymes'] = rint(1, 10000);

    if (r(env.dataset.pi.populated)) {
      if (r(env.dataset.pi.exact))
        this.p['pi'] = rpi();
      else if (r(env.dataset.pi.range)) {
        this.p['piRangeMin'] = rpi();
        this.p['piRangeMax'] = rpi();
      } else if (r(env.dataset.pi.max))
        this.p['piMax'] = rpi();
      else
        this.p['piMajor'] = rpi();
    }

    if (r(env.dataset.temp.populated)) {
      if (r(env.dataset.temp.exact))
        this.p['temp'] = rint(10, 30) + 'C';
      else
        this.p['temp'] = rint(10, 20) + ' - ' + rint(21, 30) + 'C';
    }

    if (r(env.dataset.method.populated))
      this.p['method'] = rentry('methods');

    if (r(env.dataset.valid.populated))
      this.p['valid'] = rentry('validsequences');

    if (r(env.dataset.sequence.populated))
      this.p['sequence'] = 'http://www.ncbi.nlm.nih.gov/protein/' + rstring(8);

    if (r(env.dataset.species.populated)) {
      this.p['species'] = 'http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?lvl=0&id=' + rstring(8);
    }

    if (r(env.dataset.citation.populated)) {
      if (r(env.dataset.citation.full))
        this.p['full'] = 'http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1177738/pdf/biochemj' + rstring(8);
      else
        this.p['abstract'] = 'http://www.sciencedirect.com/science/article/pii/' + rstring(16);
    }

    if (r(env.dataset.pubmed.populated))
      this.p['pubmed'] = 'http://www.ncbi.nlm.nih.gov/pubmed/' + rstring(8);

    if (r(env.dataset.notes.populated))
      this.p['notes'] = rentry('notes');
  }
}

/*
 * @return Tab-seperated format tuple
 */
Tuple.prototype.toCSV = function() {
  var string = '';

  for (var key in this.p) {
    string += this.p[key] + '\t';
  }

  return string;
}

/* Initialise command line parameter parsing */
var argv = require('optimist')
    .default('f', 'CSV')
    .default('p', './png-payload.js')
    .default('s', 512)
    .default('o', './dataset.csv')
    .argv;

/* Set args from long options */
if (argv.conf !== undefined)
  argv.c = argv.conf;
if (argv.payload !== undefined)
  argv.p = argv.payload;
if (!isNaN(argv.size))
  argv.s = argv.size;
if (argv.output !== undefined)
  argv.o = argv.output;
if (argv.format !== undefined)
  argv.f = argv.format;

if (argv.h || argv.help) {
  usage();
  process.exit(0);
}

/* Setup our environment */
var env = {
  debug: false,
  includes: {
    payload: argv.p,
  },
  output: argv.o
};

/* Use a configuration file if specified */
if (argv.c !== undefined)
  env.includes.conf = argv.c;

global.Configuration = {
  format: 'CSV',
  size: 5775,
  dataset: {
    dataset: {
      populated: 1.0
    },
    ec: {
      populated: 0.9581
    },
    protein: {
      populated: 0.9998
    },
    alt: {
      populated: 0.6567
    },
    source: {
      populated: 1.0
    },
    organ: {
      populated: 0.6656
    },
    mw: {
      populated: 0.5994
    },
    subunit: {
      populated: 0.35,
      no: {
        populated: 0.7
      },
      mw: {
        populated: 0.9
      }
    },
    isoenzymes: {
      populated: 0.6065
    },
    pi: {
      populated: 1.0,
      exact: 0.8085,
      range: 0.057,
      max: 0.0253
    },
    temp: {
      populated: 0.2629,
      exact: 0.7
      /* Range is implied */
    },
    method: {
      populated: 0.9009
    },
    valid: {
      populated: 99.93
    },
    sequence: {
      populated: 0.6363
    },
    species: {
      populated: 0.9716
    },
    citation: {
      populated: 0.9382,
      full: 0.65
      /* abstract is implied */
    },
    pubmed: {
      populated: 0.9101
    },
    notes: {
      populated: 0.02
    }
  }
};

/* Global variable set TRUE if executed with '-d' or '--debug' flags */
env.debug = argv.d || argv.debug ? true : false;

 /* Let's print some useful environmental info before getting stuck in */
debug('using payload file: \'' + env.includes.payload + '\'');
if (env.includes.conf !== undefined)
  debug('using configuration file: \'' + env.includes.conf + '\'');
else
  debug('not using configuration file');
debug('writing output to file: \'' + env.output + '\'');

/* Fire up the file system */
var fs = require('fs');

/* Load the files in our list of includes. Any error is here is considered
 * fatal */
for (var file in env.includes) {
  try {
    require(env.includes[file]);
  } catch (e) {
    fatal('failed to open \'' + env.includes[file] + '\'!');
  }
}

Configuration.format = argv.f;
Configuration.size = argv.s;

/* Set out local environment from external files */
for (key in Configuration)
  env[key] = Configuration[key];

env.payload = Payload;

/* Last minute sanity checks */
if (env.payload === undefined) {
  fatal('no payload found!');
}

if (Configuration === undefined) {
  fatal('no configuration found!');
}

/* Print some more useful debugging info */
debug('generating ' + env.size + ' records');
debug('output file format: ' + Configuration.format);

/* Instantiate dataset */
var dataset = '';

/* Populate dataset */
for (var i = 0; i <= env.size; i++) {
  var t = new Tuple(i === 0 ? 1 : 0);

  switch (env.format) {
  case 'CSV':
    dataset += t.toCSV() + '\n';
    break;
  default:
    fatal('unrecognised file format!');
    break;
  }
}

/* Write the dataset to file */
fs.writeFile(env.output, dataset, function(err) {
  if (err)
    fatal('failed to write to \'' + env.output + '\'!');
});
