# Custom Workflow Plugins

## Introduction to Workflow Plugins

Workflow plugins are custom extensions that integrate AI capabilities directly into your team's existing development tools and processes. While prompts and workflows provide reusable patterns, plugins embed these patterns into the tools engineers use daily, making AI assistance seamless and contextual.

A well-designed plugin transforms AI from a separate tool that engineers must consciously invoke into an ambient capability that surfaces automatically when needed, with full awareness of the current work context.

## Plugin Architecture Patterns

### Pattern 1: IDE Extensions

Integrate AI workflows directly into the development environment.

**VS Code Extension Example**:

```typescript
// extension.ts
import * as vscode from 'vscode';
import { TeamWorkflowClient } from './team-workflows';

export function activate(context: vscode.ExtensionContext) {
    const workflowClient = new TeamWorkflowClient();
    
    // Register command: Generate REST endpoint
    let generateEndpoint = vscode.commands.registerCommand(
        'teamAI.generateRestEndpoint',
        async () => {
            // Get user input
            const service = await vscode.window.showInputBox({
                prompt: 'Service name',
                placeHolder: 'order-service'
            });
            
            const resource = await vscode.window.showInputBox({
                prompt: 'Resource name (singular)',
                placeHolder: 'order'
            });
            
            const operation = await vscode.window.showQuickPick(
                ['GET list', 'GET retrieve', 'POST create', 'PUT update', 'DELETE delete'],
                { placeHolder: 'Select operation' }
            );
            
            // Execute workflow
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating endpoint...',
                cancellable: false
            }, async (progress) => {
                const result = await workflowClient.execute('rest-endpoint-complete', {
                    service_name: service,
                    resource: resource,
                    operation: operation
                });
                
                // Create files
                for (const file of result.files) {
                    const uri = vscode.Uri.file(file.path);
                    await vscode.workspace.fs.writeFile(
                        uri,
                        Buffer.from(file.content, 'utf8')
                    );
                }
                
                // Show summary
                vscode.window.showInformationMessage(
                    `Generated ${result.files.length} files for ${resource} endpoint`
                );
                
                // Open main file
                const doc = await vscode.workspace.openTextDocument(result.files[0].path);
                await vscode.window.showTextDocument(doc);
            });
        }
    );
    
    context.subscriptions.push(generateEndpoint);
    
    // Register code actions
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { language: 'python' },
            new TeamAICodeActionProvider(workflowClient)
        )
    );
    
    // Register hover provider
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { language: 'python' },
            new TeamAIHoverProvider(workflowClient)
        )
    );
}

class TeamAICodeActionProvider implements vscode.CodeActionProvider {
    constructor(private client: TeamWorkflowClient) {}
    
    async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext
    ): Promise<vscode.CodeAction[]> {
        const actions: vscode.CodeAction[] = [];
        
        // Suggest adding tests
        if (this.isFunctionDefinition(document, range)) {
            const action = new vscode.CodeAction(
                'Generate unit tests',
                vscode.CodeActionKind.RefactorRewrite
            );
            action.command = {
                command: 'teamAI.generateTests',
                title: 'Generate Tests',
                arguments: [document, range]
            };
            actions.push(action);
        }
        
        // Suggest refactoring
        if (this.isComplexFunction(document, range)) {
            const action = new vscode.CodeAction(
                'Suggest refactoring',
                vscode.CodeActionKind.RefactorExtract
            );
            action.command = {
                command: 'teamAI.suggestRefactoring',
                title: 'Suggest Refactoring',
                arguments: [document, range]
            };
            actions.push(action);
        }
        
        return actions;
    }
}
```

### Pattern 2: CLI Tools

Provide command-line access to workflows for terminal-based development.

```python
#!/usr/bin/env python3
"""Team AI Workflows CLI"""

import click
import yaml
from pathlib import Path
from team_workflows import WorkflowClient

@click.group()
@click.pass_context
def cli(ctx):
    """Team AI Workflows"""
    ctx.obj = WorkflowClient()

@cli.command()
@click.argument('workflow')
@click.option('--interactive', '-i', is_flag=True, help='Interactive mode')
@click.option('--config', '-c', type=click.Path(), help='Config file')
@click.pass_obj
def run(client, workflow, interactive, config):
    """Run a workflow"""
    
    if config:
        # Load parameters from file
        with open(config) as f:
            params = yaml.safe_load(f)
    elif interactive:
        # Prompt for parameters
        workflow_def = client.get_workflow(workflow)
        params = prompt_for_parameters(workflow_def)
    else:
        click.echo("Error: Provide --config or use --interactive")
        return
    
    # Execute workflow
    with click.progressbar(
        length=100,
        label='Executing workflow'
    ) as bar:
        result = client.execute(workflow, params, progress=bar)
    
    # Display results
    click.echo(f"\n✓ Workflow completed successfully")
    click.echo(f"\nGenerated files:")
    for file in result.files:
        click.echo(f"  - {file.path}")
    
    # Offer to open in editor
    if click.confirm('Open in editor?'):
        click.edit(filename=result.files[0].path)

@cli.command()
@click.option('--category', '-c', help='Filter by category')
@click.pass_obj
def list(client, category):
    """List available workflows"""
    workflows = client.list_workflows(category=category)
    
    for workflow in workflows:
        click.echo(f"\n{workflow.name} ({workflow.id})")
        click.echo(f"  {workflow.description}")
        click.echo(f"  Category: {workflow.category}")
        click.echo(f"  Maturity: {workflow.maturity}")

@cli.command()
@click.argument('workflow')
@click.pass_obj
def info(client, workflow):
    """Get workflow details"""
    workflow_def = client.get_workflow(workflow)
    
    click.echo(f"\n{workflow_def.name}")
    click.echo("=" * len(workflow_def.name))
    click.echo(f"\n{workflow_def.description}")
    click.echo(f"\nCategory: {workflow_def.category}")
    click.echo(f"Version: {workflow_def.version}")
    click.echo(f"Maturity: {workflow_def.maturity}")
    
    click.echo("\nRequired Parameters:")
    for param in workflow_def.required_params:
        click.echo(f"  {param.name}: {param.description}")
    
    if workflow_def.optional_params:
        click.echo("\nOptional Parameters:")
        for param in workflow_def.optional_params:
            click.echo(f"  {param.name}: {param.description}")

def prompt_for_parameters(workflow_def):
    """Interactively prompt for workflow parameters"""
    params = {}
    
    click.echo(f"\n{workflow_def.name}")
    click.echo("-" * len(workflow_def.name))
    
    for param in workflow_def.required_params:
        value = click.prompt(
            f"{param.name} ({param.description})",
            type=param.type
        )
        params[param.name] = value
    
    for param in workflow_def.optional_params:
        if click.confirm(f"Provide {param.name}?", default=False):
            value = click.prompt(
                f"{param.name} ({param.description})",
                type=param.type,
                default=param.default
            )
            params[param.name] = value
    
    return params

if __name__ == '__main__':
    cli()
```

### Pattern 3: Git Hooks

Integrate AI workflows into git operations.

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Team AI Pre-Commit Hook

echo "Running team AI checks..."

# Check for auto-generated code that needs review
team-ai check-generated --staged

# Suggest tests for new functions
team-ai suggest-tests --staged

# Validate against team standards
team-ai validate-standards --staged

# Generate/update API docs if needed
if git diff --cached --name-only | grep -q "controllers/"; then
    echo "API changes detected, updating OpenAPI spec..."
    team-ai update-openapi-spec
    git add docs/openapi.yaml
fi

# Run security scan
team-ai security-scan --staged

echo "Pre-commit checks complete"
```

```bash
#!/bin/bash
# .git/hooks/prepare-commit-msg

# Generate commit message suggestions

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

if [ -z "$COMMIT_SOURCE" ]; then
    # No source (not amend, merge, etc.), generate suggestion
    
    # Get staged changes
    DIFF=$(git diff --cached)
    
    # Generate commit message
    SUGGESTION=$(team-ai generate-commit-message "$DIFF")
    
    # Prepend to commit message file
    echo "# AI-suggested commit message:" > "$COMMIT_MSG_FILE.tmp"
    echo "# $SUGGESTION" >> "$COMMIT_MSG_FILE.tmp"
    echo "#" >> "$COMMIT_MSG_FILE.tmp"
    echo "# Edit or replace with your own message" >> "$COMMIT_MSG_FILE.tmp"
    echo "" >> "$COMMIT_MSG_FILE.tmp"
    cat "$COMMIT_MSG_FILE" >> "$COMMIT_MSG_FILE.tmp"
    mv "$COMMIT_MSG_FILE.tmp" "$COMMIT_MSG_FILE"
fi
```

### Pattern 4: CI/CD Integration

Embed AI workflows into continuous integration pipelines.

```yaml
# .github/workflows/ai-assisted-review.yml
name: AI-Assisted Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      
      - name: Setup Team AI
        run: |
          pip install team-ai-workflows
          team-ai configure --token ${{ secrets.TEAM_AI_TOKEN }}
      
      - name: Run AI Code Review
        id: review
        run: |
          team-ai review-pr \
            --pr-number ${{ github.event.pull_request.number }} \
            --output review.json
      
      - name: Post Review Comments
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = JSON.parse(fs.readFileSync('review.json'));
            
            for (const comment of review.comments) {
              await github.rest.pulls.createReviewComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: context.issue.number,
                body: comment.body,
                path: comment.path,
                line: comment.line
              });
            }
      
      - name: Generate Test Suggestions
        run: |
          team-ai suggest-tests \
            --pr-number ${{ github.event.pull_request.number }} \
            --output test-suggestions.md
      
      - name: Post Test Suggestions
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const suggestions = fs.readFileSync('test-suggestions.md', 'utf8');
            
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: suggestions
            });
```

## Building Plugin Infrastructure

### Plugin SDK

Provide a standard SDK for building plugins:

```python
# team_ai_sdk/plugin.py

from abc import ABC, abstractmethod
from typing import Dict, Any, List
from dataclasses import dataclass

@dataclass
class PluginMetadata:
    name: str
    version: str
    description: str
    author: str
    requires: List[str]

class Plugin(ABC):
    """Base class for Team AI plugins"""
    
    @property
    @abstractmethod
    def metadata(self) -> PluginMetadata:
        """Plugin metadata"""
        pass
    
    @abstractmethod
    def initialize(self, context: Dict[str, Any]):
        """Initialize plugin with context"""
        pass
    
    @abstractmethod
    def execute(self, action: str, params: Dict[str, Any]) -> Any:
        """Execute plugin action"""
        pass
    
    def cleanup(self):
        """Cleanup resources"""
        pass

class PluginRegistry:
    """Central plugin registry"""
    
    def __init__(self):
        self.plugins: Dict[str, Plugin] = {}
    
    def register(self, plugin: Plugin):
        """Register a plugin"""
        metadata = plugin.metadata
        
        # Check dependencies
        for dep in metadata.requires:
            if dep not in self.plugins:
                raise ValueError(f"Missing dependency: {dep}")
        
        # Initialize
        plugin.initialize({
            'registry': self,
            'config': self.load_config(metadata.name)
        })
        
        # Register
        self.plugins[metadata.name] = plugin
    
    def get_plugin(self, name: str) -> Plugin:
        """Get registered plugin"""
        if name not in self.plugins:
            raise ValueError(f"Plugin not found: {name}")
        return self.plugins[name]
    
    def execute(self, plugin_name: str, action: str, params: Dict[str, Any]) -> Any:
        """Execute plugin action"""
        plugin = self.get_plugin(plugin_name)
        return plugin.execute(action, params)
```

### Example Plugin Implementation

```python
# plugins/code_review_plugin.py

from team_ai_sdk.plugin import Plugin, PluginMetadata
from typing import Dict, Any

class CodeReviewPlugin(Plugin):
    """AI-assisted code review plugin"""
    
    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="code-review",
            version="1.0.0",
            description="AI-assisted code review",
            author="engineering-team",
            requires=["context-manager", "prompt-library"]
        )
    
    def initialize(self, context: Dict[str, Any]):
        """Initialize plugin"""
        self.context_manager = context['registry'].get_plugin('context-manager')
        self.prompt_library = context['registry'].get_plugin('prompt-library')
        self.config = context['config']
    
    def execute(self, action: str, params: Dict[str, Any]) -> Any:
        """Execute action"""
        if action == "review-file":
            return self.review_file(params)
        elif action == "review-diff":
            return self.review_diff(params)
        elif action == "suggest-improvements":
            return self.suggest_improvements(params)
        else:
            raise ValueError(f"Unknown action: {action}")
    
    def review_file(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Review a single file"""
        file_path = params['file_path']
        file_content = params['file_content']
        
        # Load context
        context = self.context_manager.execute('load-for-task', {
            'task_type': 'code_review',
            'file_type': self.detect_file_type(file_path)
        })
        
        # Get review prompt
        prompt = self.prompt_library.execute('get-prompt', {
            'prompt_id': 'code-review-file'
        })
        
        # Execute review
        review_result = self.execute_prompt(prompt, {
            'file_path': file_path,
            'file_content': file_content,
            'context': context
        })
        
        return {
            'file_path': file_path,
            'issues': review_result['issues'],
            'suggestions': review_result['suggestions'],
            'quality_score': review_result['quality_score']
        }
    
    def review_diff(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Review git diff"""
        diff = params['diff']
        
        # Parse diff
        changes = self.parse_diff(diff)
        
        # Review each file
        reviews = []
        for change in changes:
            review = self.review_file({
                'file_path': change['file'],
                'file_content': change['content']
            })
            reviews.append(review)
        
        # Generate summary
        summary = self.generate_review_summary(reviews)
        
        return {
            'reviews': reviews,
            'summary': summary,
            'overall_score': self.calculate_overall_score(reviews)
        }
```

## Plugin Discovery and Installation

### Plugin Marketplace

```python
class PluginMarketplace:
    """Central marketplace for team AI plugins"""
    
    def __init__(self, marketplace_url):
        self.marketplace_url = marketplace_url
    
    def search(self, query: str, filters: Dict[str, Any] = None):
        """Search for plugins"""
        response = requests.get(
            f"{self.marketplace_url}/search",
            params={'q': query, **filters}
        )
        return response.json()['plugins']
    
    def get_plugin_info(self, plugin_id: str):
        """Get detailed plugin information"""
        response = requests.get(
            f"{self.marketplace_url}/plugins/{plugin_id}"
        )
        return response.json()
    
    def install(self, plugin_id: str, version: str = 'latest'):
        """Install a plugin"""
        # Download plugin
        plugin_url = f"{self.marketplace_url}/plugins/{plugin_id}/download/{version}"
        response = requests.get(plugin_url)
        
        # Extract to plugins directory
        plugin_dir = Path("plugins") / plugin_id
        plugin_dir.mkdir(parents=True, exist_ok=True)
        
        with ZipFile(BytesIO(response.content)) as zip_file:
            zip_file.extractall(plugin_dir)
        
        # Install dependencies
        requirements_file = plugin_dir / "requirements.txt"
        if requirements_file.exists():
            subprocess.run([
                "pip", "install", "-r", str(requirements_file)
            ])
        
        return self.load_plugin(plugin_dir)
    
    def update(self, plugin_id: str):
        """Update a plugin to latest version"""
        current_version = self.get_installed_version(plugin_id)
        latest_version = self.get_latest_version(plugin_id)
        
        if current_version != latest_version:
            self.install(plugin_id, latest_version)
            return True
        return False
```

## Plugin Configuration

### Configuration Schema

```yaml
# .team-ai/plugins.yaml
plugins:
  enabled:
    - code-review
    - test-generation
    - documentation
    - security-scan
  
  configurations:
    code-review:
      auto_review_on_pr: true
      minimum_quality_score: 7
      block_on_critical_issues: true
      review_patterns:
        - "**/*.py"
        - "**/*.ts"
        - "**/*.java"
    
    test-generation:
      auto_generate_on_new_code: true
      minimum_coverage: 0.80
      test_frameworks:
        python: pytest
        typescript: jest
        java: junit
    
    documentation:
      auto_update_on_code_change: true
      formats:
        - markdown
        - openapi
      
    security-scan:
      scan_on_commit: true
      severity_threshold: medium
      auto_fix_when_possible: true
```

### Plugin Management CLI

```bash
# List installed plugins
team-ai plugins list

# Search marketplace
team-ai plugins search "code review"

# Get plugin info
team-ai plugins info code-review

# Install plugin
team-ai plugins install code-review

# Update plugin
team-ai plugins update code-review

# Configure plugin
team-ai plugins configure code-review

# Enable/disable plugin
team-ai plugins enable code-review
team-ai plugins disable code-review

# Uninstall plugin
team-ai plugins uninstall code-review
```

## Advanced Plugin Patterns

### Event-Driven Plugins

Plugins that react to development events:

```python
class EventDrivenPlugin(Plugin):
    """Plugin that responds to events"""
    
    def initialize(self, context: Dict[str, Any]):
        self.event_bus = context['event_bus']
        
        # Register event handlers
        self.event_bus.on('file.saved', self.on_file_saved)
        self.event_bus.on('git.commit', self.on_commit)
        self.event_bus.on('pr.opened', self.on_pr_opened)
    
    async def on_file_saved(self, event):
        """Handle file save event"""
        file_path = event['file_path']
        
        # Auto-format if needed
        if self.should_format(file_path):
            await self.format_file(file_path)
        
        # Generate tests if configured
        if self.config.get('auto_generate_tests'):
            await self.generate_tests(file_path)
    
    async def on_commit(self, event):
        """Handle git commit event"""
        # Scan for security issues
        issues = await self.security_scan(event['files'])
        
        if issues:
            self.notify_developer(issues)
    
    async def on_pr_opened(self, event):
        """Handle PR opened event"""
        pr_number = event['pr_number']
        
        # Start AI review
        await self.review_pr(pr_number)
```

### Composite Plugins

Plugins that combine multiple capabilities:

```python
class FeatureImplementationPlugin(Plugin):
    """End-to-end feature implementation plugin"""
    
    def initialize(self, context: Dict[str, Any]):
        # Get sub-plugins
        self.code_gen = context['registry'].get_plugin('code-generation')
        self.test_gen = context['registry'].get_plugin('test-generation')
        self.docs_gen = context['registry'].get_plugin('documentation')
        self.review = context['registry'].get_plugin('code-review')
    
    def execute(self, action: str, params: Dict[str, Any]):
        if action == "implement-feature":
            return self.implement_feature(params)
    
    def implement_feature(self, params: Dict[str, Any]):
        """Implement complete feature"""
        feature_spec = params['feature_spec']
        
        # Generate code
        code = self.code_gen.execute('generate', {
            'spec': feature_spec
        })
        
        # Generate tests
        tests = self.test_gen.execute('generate', {
            'code': code,
            'coverage': 0.85
        })
        
        # Generate documentation
        docs = self.docs_gen.execute('generate', {
            'code': code,
            'feature_spec': feature_spec
        })
        
        # Review everything
        review = self.review.execute('review-all', {
            'code': code,
            'tests': tests,
            'docs': docs
        })
        
        return {
            'code': code,
            'tests': tests,
            'docs': docs,
            'review': review
        }
```

## Measuring Plugin Effectiveness

```python
class PluginMetrics:
    """Track plugin usage and impact"""
    
    def track_execution(self, plugin_name, action, duration, success):
        """Record plugin execution"""
        self.db.insert('plugin_executions', {
            'plugin': plugin_name,
            'action': action,
            'duration_ms': duration,
            'success': success,
            'timestamp': datetime.now()
        })
    
    def get_plugin_stats(self, plugin_name, days=30):
        """Get plugin statistics"""
        return self.db.query(f"""
            SELECT 
                COUNT(*) as executions,
                AVG(duration_ms) as avg_duration,
                SUM(CASE WHEN success THEN 1 ELSE 0 END) / COUNT(*) as success_rate,
                COUNT(DISTINCT DATE(timestamp)) as active_days
            FROM plugin_executions
            WHERE plugin = '{plugin_name}'
            AND timestamp > NOW() - INTERVAL '{days} days'
        """)
    
    def get_impact_metrics(self, plugin_name):
        """Calculate plugin impact metrics"""
        # Before/after comparison
        baseline = self.get_baseline_metrics(plugin_name)
        current = self.get_current_metrics(plugin_name)
        
        return {
            'productivity_improvement': (
                current['velocity'] - baseline['velocity']
            ) / baseline['velocity'],
            'quality_improvement': (
                current['defect_rate'] - baseline['defect_rate']
            ) / baseline['defect_rate'],
            'time_saved_hours': current['time_saved']
        }
```

## Conclusion

Workflow plugins transform AI from an external tool into an integrated capability woven throughout the development workflow. Well-designed plugins:

- Embed AI assistance into existing tools and processes
- Provide contextual, timely suggestions
- Automate routine quality checks
- Capture and apply team knowledge consistently

Teams that build robust plugin ecosystems see:
- 50-70% reduction in context switching
- 40-60% increase in AI feature adoption
- 30-50% improvement in consistency
- 20-40% faster feature delivery

Start with high-value integration points. Build incrementally. Measure impact. Refine based on usage patterns.

Next, we'll explore knowledge sharing systems that capture and distribute team learning at scale.
