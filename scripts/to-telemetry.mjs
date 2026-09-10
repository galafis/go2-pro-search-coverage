import { readFile, writeFile } from 'node:fs/promises';
import { toTelemetry } from '../src/engine.js';
try {
  const [input, output, period = '1000', ...extra] = process.argv.slice(2);
  if (!input || !output || extra.length)
    throw new Error(
      'Usage: node scripts/to-telemetry.mjs scenario.json telemetry.json [sample-period-ms]',
    );
  const data = await readFile(input, 'utf8');
  if (Buffer.byteLength(data) > 1000000) throw new Error('Input exceeds 1 MB.');
  const result = toTelemetry(JSON.parse(data), Number(period));
  await writeFile(output, JSON.stringify(result, null, 2) + '\n');
  console.log(
    'Synthetic trace exported. batteryPct=100 is a placeholder, not a battery model. / Trajeto sintético exportado. batteryPct=100 é um valor ilustrativo, não um modelo de bateria.',
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
