import { config } from 'dotenv';

config({ path: '.env.local' });

import { faker } from '@faker-js/faker';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'go',
  'rust',
  'java',
  'ruby',
  'php',
  'c',
  'cpp',
];

const VERDICTS = [
  'needs_serious_help',
  'rough_around_edges',
  'decent_code',
  'solid_work',
  'exceptional',
];

const CODE_SAMPLES = [
  'function process() { var data = req.body.data; var result = []; for (var i = 0; i < data.length; i++) { result.push(data[i].value * 2); } return result; }',
  'const handle = (req, res) => { let x = req.query.x; let y = req.query.y; if (x == y) { return true; } else { return false; } };',
  'module.exports = { add: function(a, b) { return a + b; }, sub: function(a, b) { return a - b; }, mul: function(a, b) { return a * b; } };',
  'async function fetchData(url) { const response = await fetch(url); const data = await response.json(); return data; }',
  'def process(data): result = []; [result.append(x * 2) for x in data]; return result',
  'class Handler: def __init__(self): self.data = [] def add(self, item): self.data.append(item)',
  'func process(items []int) []int { result := make([]int, len(items)); for i, v := range items { result[i] = v * 2 }; return result }',
  'type User struct { ID int; Name string; Email string }; var users []User',
  'fn process(items: Vec<i32>) -> Vec<i32> { items.iter().map(|x| x * 2).collect() }',
  'struct User { id: u32, name: String, email: String }',
  'public class Handler { private List<String> data = new ArrayList<>(); public void add(String item) { data.add(item); } }',
  'class Handler { attr_accessor :data; def initialize; @data = []; end; def add(item); @data << item; end; end',
  'function process($items) { return array_map(fn($x) => $x * 2, $items); }',
  'int process(int* items, int len) { int sum = 0; for (int i = 0; i < len; i++) sum += items[i]; return sum; }',
  'std::vector<int> process(const std::vector<int>& items) { std::vector<int> result; for (int x : items) result.push_back(x * 2); return result; }',
];

const ANALYSIS_TEMPLATES = [
  {
    severity: 'critical',
    title: 'Variável global sem encapsulamento',
    description:
      'Usar variáveis globais pode causar conflitos e bugs difíceis de rastrear.',
  },
  {
    severity: 'critical',
    title: 'Sem validação de entrada',
    description:
      'Dados de entrada não são validados, podendo causar erros ou vulnerabilidades.',
  },
  {
    severity: 'critical',
    title: 'Memory leak potencial',
    description: 'Recursos não estão sendo liberados corretamente.',
  },
  {
    severity: 'warning',
    title: 'Nome de variável não descritivo',
    description: 'x, y, data são nomes que não comunicam intenção.',
  },
  {
    severity: 'warning',
    title: 'Função muito longa',
    description: 'Consider拆分 em funções menores com responsabilidade única.',
  },
  {
    severity: 'warning',
    title: 'Magic numbers',
    description: 'Números mágicos devem ser constantes nomeadas.',
  },
  {
    severity: 'good',
    title: 'Boa nomenclatura de função',
    description: 'Nome descritivo que comunica claramente o propósito.',
  },
  {
    severity: 'good',
    title: 'DRY implementado',
    description: 'Código reutilizado através de abstrações adequadas.',
  },
];

const ROAST_QUOTES = [
  'Isso não é código, é uma carta de amor para technical debt.',
  'Parabéns, você acabou de inventar a entropia de software.',
  'Se isso fosse um filme, seria classificado como horror.',
  'O lint passou? Impossível.',
  'Seu código tem mais issues do que um software de gestão governamental.',
  'Isso vai funcionar até alguém respirar perto do servidor.',
  'A complexidade ciclomática desse código é maior que meu score no Tinder.',
  'Parabéns, você alcançou um novo nível de spaghetti code.',
];

function getScoreFromVerdict(verdict: string): number {
  switch (verdict) {
    case 'needs_serious_help':
      return faker.number.float({ min: 0, max: 2, fractionDigits: 1 });
    case 'rough_around_edges':
      return faker.number.float({ min: 2.1, max: 4, fractionDigits: 1 });
    case 'decent_code':
      return faker.number.float({ min: 4.1, max: 6, fractionDigits: 1 });
    case 'solid_work':
      return faker.number.float({ min: 6.1, max: 8, fractionDigits: 1 });
    case 'exceptional':
      return faker.number.float({ min: 8.1, max: 10, fractionDigits: 1 });
    default:
      return 5;
  }
}

async function seed() {
  console.log('🌱 Starting seed...');

  const client = await pool.connect();

  try {
    await client.query('DELETE FROM analysis_items');
    await client.query('DELETE FROM roasts');
    console.log('🗑️  Cleared existing data');

    await client.query('BEGIN');

    for (let i = 0; i < 100; i++) {
      const language =
        LANGUAGES[faker.number.int({ min: 0, max: LANGUAGES.length - 1 })];
      const verdict =
        VERDICTS[faker.number.int({ min: 0, max: VERDICTS.length - 1 })];
      const score = getScoreFromVerdict(verdict);
      const roastMode = faker.datatype.boolean();
      const code =
        CODE_SAMPLES[
          faker.number.int({ min: 0, max: CODE_SAMPLES.length - 1 })
        ];
      const lineCount = code.split('\n').length;
      const roastQuote =
        ROAST_QUOTES[
          faker.number.int({ min: 0, max: ROAST_QUOTES.length - 1 })
        ];
      const suggestedFix = faker.datatype.boolean()
        ? code + '\n\n// Refatorado!'
        : null;
      const createdAt = faker.date.past({ years: 1 }).toISOString();

      const roastResult = await client.query(
        `INSERT INTO roasts (code, language, line_count, roast_mode, score, verdict, roast_quote, suggested_fix, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
          code,
          language,
          lineCount,
          roastMode,
          score,
          verdict,
          roastQuote,
          suggestedFix,
          createdAt,
        ]
      );

      const roastId = roastResult.rows[0].id;

      const numItems = faker.number.int({ min: 2, max: 6 });
      const shuffled = [...ANALYSIS_TEMPLATES].sort(() => 0.5 - Math.random());

      for (let j = 0; j < numItems; j++) {
        const item = shuffled[j];
        await client.query(
          `INSERT INTO analysis_items (roast_id, severity, title, description, "order")
           VALUES ($1, $2, $3, $4, $5)`,
          [roastId, item.severity, item.title, item.description, j]
        );
      }

      if ((i + 1) % 20 === 0) {
        console.log(`✅ Inserted ${i + 1}/100 roasts`);
      }
    }

    await client.query('COMMIT');
    console.log('✅ Seed completed!');

    const result = await client.query('SELECT COUNT(*) FROM roasts');
    const itemsResult = await client.query(
      'SELECT COUNT(*) FROM analysis_items'
    );
    console.log(`📊 Total roasts: ${result.rows[0].count}`);
    console.log(`📊 Total analysis items: ${itemsResult.rows[0].count}`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
