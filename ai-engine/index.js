// Loop Engineering - AI Orchestration Layer for Vachanam
const { LoopRunner } = require('./core/LoopRunner');
const { ExecutionContext } = require('./core/ExecutionContext');
const stateStore = require('./core/StateStore');
const { QueueManager, defaultQueue } = require('./core/QueueManager');

const { VerificationPipeline } = require('./verifiers/VerificationPipeline');
const { defaultExplanationVerifier } = require('./verifiers/ExplanationVerifier');
const {
  defaultDiagramVerifier,
  defaultImageVerifier,
  defaultBibleTextVerifier
} = require('./verifiers/DomainVerifiers');

const prompts = require('./prompts');
const { defaultCacheManager } = require('./cache/AICacheManager');

const { defaultAIProvider } = require('./services/aiModelProvider');
const {
  defaultImageGenProvider,
  defaultTTSProvider,
  defaultStorageProvider
} = require('./services/mediaProviders');

const { defaultVerseExplanationLoop } = require('./loops/VerseExplanationLoop');
const {
  defaultDiagramLoop,
  defaultVerseImageLoop,
  defaultAudioLoop
} = require('./loops/MediaLoops');
const {
  defaultBibleImportLoop,
  defaultSearchIndexLoop,
  defaultCacheManagementLoop,
  defaultQALoop,
  defaultMonitoringLoop
} = require('./loops/OperationalLoops');
const { defaultDailyVerseLoop } = require('./loops/DailyVerseLoop');
const {
  IllustrationEngine,
  defaultIllustrationEngine
} = require('./loops/illustration/IllustrationEngine');
const { defaultContentAnalyzer } = require('./loops/illustration/ContentAnalyzer');
const { defaultVisualMetaphorGenerator } = require('./loops/illustration/VisualMetaphorGenerator');
const illustrationPrompts = require('./prompts/illustrations');

const {
  DailyVersePipelineWorkflow,
  FullBibleEnrichmentWorkflow,
  WorkflowRegistry
} = require('./workflows/Workflows');

const {
  defaultScheduler,
  defaultAnalytics,
  defaultQAReportGenerator
} = require('./utilities/auxiliary');

const logger = require('./utilities/logger');

module.exports = {
  // Core
  LoopRunner,
  ExecutionContext,
  stateStore,
  QueueManager,
  defaultQueue,

  // Verifiers
  VerificationPipeline,
  defaultExplanationVerifier,
  defaultDiagramVerifier,
  defaultImageVerifier,
  defaultBibleTextVerifier,

  // Prompts & Cache
  prompts,
  defaultCacheManager,

  // Providers & Services
  defaultAIProvider,
  defaultImageGenProvider,
  defaultTTSProvider,
  defaultStorageProvider,

  // Loops & Illustration Engine
  defaultVerseExplanationLoop,
  defaultDiagramLoop,
  defaultVerseImageLoop,
  defaultAudioLoop,
  defaultBibleImportLoop,
  defaultSearchIndexLoop,
  defaultCacheManagementLoop,
  defaultQALoop,
  defaultMonitoringLoop,
  defaultDailyVerseLoop,
  IllustrationEngine,
  defaultIllustrationEngine,
  defaultContentAnalyzer,
  defaultVisualMetaphorGenerator,
  illustrationPrompts,

  // Workflows
  DailyVersePipelineWorkflow,
  FullBibleEnrichmentWorkflow,
  WorkflowRegistry,

  // Schedulers, Analytics & Reporting
  defaultScheduler,
  defaultAnalytics,
  defaultQAReportGenerator,
  logger
};
