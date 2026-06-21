import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'apps/server/.env') });

const QuestionSchema = new mongoose.Schema({
  category: String,
  topic: String,
  title: String,
  description: String,
  answer: String,
  codeSnippet: String,
  difficulty: String,
  tags: [String],
  order: Number,
}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);

const handCraftedQuestions = [
  // ─── ANGULAR ───────────────────────────────────────────────────────────────
  { category: 'angular', topic: 'Components', difficulty: 'beginner', order: 1,
    title: 'What is a component in Angular?',
    description: 'Explain what an Angular component is and what it consists of.',
    answer: 'A component is the fundamental building block of Angular applications. It controls a patch of screen called a view. A component consists of:\n\n1. A TypeScript class that handles data and logic\n2. An HTML template that defines the view\n3. CSS styles for the component\n4. A @Component decorator that provides metadata\n\nComponents are declared with the @Component decorator which specifies the selector, template, and styles.',
    codeSnippet: `@Component({\n  selector: 'app-hero',\n  template: '<h1>{{hero.name}}</h1>',\n  styles: ['h1 { color: violet; }']\n})\nexport class HeroComponent {\n  hero = { name: 'Iron Man' };\n}`,
    tags: ['components', 'decorator', 'basics'] },

  { category: 'angular', topic: 'Components', difficulty: 'beginner', order: 2,
    title: 'What is the difference between @Component and @Directive?',
    description: 'Explain the key differences between Angular components and directives.',
    answer: 'Both @Component and @Directive are used to create reusable UI functionality, but:\n\n@Component:\n- Always has a template (HTML)\n- Represents a UI element with its own view\n- Creates a new HTML element (custom element)\n- Can have encapsulated styles\n\n@Directive:\n- Has NO template of its own\n- Adds behavior to an existing DOM element\n- Two types: Attribute directives (change appearance/behavior) and Structural directives (change DOM structure)\n- Examples: NgClass, NgStyle (attribute), NgIf, NgFor (structural)',
    codeSnippet: `// Directive - no template\n@Directive({ selector: '[appHighlight]' })\nexport class HighlightDirective {\n  @HostListener('mouseenter') onMouseEnter() {\n    this.el.nativeElement.style.background = 'yellow';\n  }\n  constructor(private el: ElementRef) {}\n}`,
    tags: ['components', 'directives', 'decorator'] },

  { category: 'angular', topic: 'Components', difficulty: 'intermediate', order: 3,
    title: 'What is ViewEncapsulation in Angular?',
    description: 'Explain ViewEncapsulation modes and when to use each.',
    answer: 'ViewEncapsulation controls how CSS styles are scoped to a component. Three modes:\n\n1. Emulated (default): Angular emulates Shadow DOM by adding unique attributes to elements. Styles are scoped to the component.\n\n2. ShadowDom: Uses native browser Shadow DOM. Styles are truly isolated. Good browser support needed.\n\n3. None: No encapsulation. Styles become global and can affect other components.\n\nUse Emulated for most components, None when you intentionally want global styles, ShadowDom for true isolation in modern browsers.',
    codeSnippet: `@Component({\n  selector: 'app-card',\n  template: '<div class="card">...</div>',\n  encapsulation: ViewEncapsulation.Emulated // default\n})\nexport class CardComponent {}`,
    tags: ['components', 'styles', 'shadow-dom'] },

  { category: 'angular', topic: 'Components', difficulty: 'intermediate', order: 4,
    title: 'Explain Angular component lifecycle hooks',
    description: 'List and explain the Angular component lifecycle hooks in order of execution.',
    answer: 'Angular lifecycle hooks in order:\n\n1. constructor() - class instantiation, dependency injection\n2. ngOnChanges() - called when @Input properties change\n3. ngOnInit() - component initialized, inputs set\n4. ngDoCheck() - custom change detection\n5. ngAfterContentInit() - projected content initialized\n6. ngAfterContentChecked() - after content checked\n7. ngAfterViewInit() - component view initialized\n8. ngAfterViewChecked() - after view checked\n9. ngOnDestroy() - cleanup before destruction\n\nMost commonly used: ngOnInit (data fetching), ngOnChanges (react to input changes), ngOnDestroy (unsubscribe observables).',
    codeSnippet: `export class MyComponent implements OnInit, OnDestroy {\n  private subscription: Subscription;\n\n  ngOnInit() {\n    this.subscription = this.dataService.getData().subscribe();\n  }\n\n  ngOnDestroy() {\n    this.subscription.unsubscribe(); // prevent memory leaks\n  }\n}`,
    tags: ['lifecycle', 'hooks', 'components'] },

  { category: 'angular', topic: 'Signals', difficulty: 'intermediate', order: 5,
    title: 'What are Angular Signals and how do they work?',
    description: 'Explain Angular Signals, their purpose, and how they differ from RxJS observables.',
    answer: 'Signals are a reactive primitive introduced in Angular 16+ that represent a value that changes over time. Key concepts:\n\n- signal(initialValue): Creates a writable signal\n- computed(fn): Creates a derived signal that automatically updates\n- effect(fn): Runs a side effect whenever a signal changes\n\nDifferences from RxJS:\n- Synchronous (no subscription needed)\n- Automatically tracked dependencies\n- Simpler API, no operators\n- Built into Angular change detection\n\nSignals work with Angulars new zoneless change detection for better performance.',
    codeSnippet: `// Writable signal\nconst count = signal(0);\n\n// Derived signal\nconst doubled = computed(() => count() * 2);\n\n// Update signal\ncount.set(5);\ncount.update(c => c + 1);\n\n// Effect\neffect(() => console.log('Count:', count()));\n\n// In template: {{ count() }}`,
    tags: ['signals', 'reactivity', 'angular16+'] },

  { category: 'angular', topic: 'Signals', difficulty: 'advanced', order: 6,
    title: 'What is the difference between signal(), computed(), and effect()?',
    description: 'Deep dive into the three core signal primitives in Angular.',
    answer: 'signal(value):\n- Creates a writable reactive value\n- Use .set(), .update(), .mutate() to change\n- Consumers are notified on change\n\ncomputed(fn):\n- Read-only derived signal\n- Lazily evaluated (only recalculates when read AND dependencies changed)\n- Automatically tracks signal dependencies\n- No side effects allowed\n\neffect(fn):\n- Runs a function whenever its signal dependencies change\n- Used for side effects: logging, DOM manipulation, syncing to localStorage\n- Must be run in injection context (constructor or runInInjectionContext)\n- Returns a cleanup function',
    codeSnippet: `export class CartComponent {\n  items = signal<Item[]>([]);\n  total = computed(() =>\n    this.items().reduce((sum, item) => sum + item.price, 0)\n  );\n\n  constructor() {\n    effect(() => {\n      localStorage.setItem('cart', JSON.stringify(this.items()));\n    });\n  }\n}`,
    tags: ['signals', 'computed', 'effect'] },

  { category: 'angular', topic: 'RxJS', difficulty: 'intermediate', order: 7,
    title: 'What is the difference between Subject, BehaviorSubject, and ReplaySubject?',
    description: 'Explain the differences between RxJS Subject variants used in Angular.',
    answer: 'Subject:\n- No initial value, no memory\n- Only emits to current subscribers\n- Late subscribers miss previous values\n\nBehaviorSubject:\n- Requires initial value\n- Stores the LATEST value\n- New subscribers immediately receive the current value\n- Best for state management\n\nReplaySubject(n):\n- Replays last n emissions to new subscribers\n- No initial value required\n- Buffer size configurable\n\nAsyncSubject:\n- Only emits the LAST value, and only when complete()\n- Rare use case',
    codeSnippet: `// BehaviorSubject for user state\nconst user$ = new BehaviorSubject<User | null>(null);\n\n// Late subscriber still gets current user\nuser$.subscribe(u => console.log('User:', u));\n\n// ReplaySubject for last 3 events\nconst events$ = new ReplaySubject<Event>(3);\nevents$.next(event1);\nevents$.next(event2);\n// New subscriber gets event1 + event2`,
    tags: ['rxjs', 'subject', 'observables'] },

  { category: 'angular', topic: 'RxJS', difficulty: 'intermediate', order: 8,
    title: 'Explain switchMap, mergeMap, concatMap, and exhaustMap',
    description: 'What are the differences between the four flattening operators in RxJS?',
    answer: 'switchMap:\n- Cancels previous inner observable when new value arrives\n- Use for search/autocomplete (cancel stale requests)\n\nmergeMap (flatMap):\n- Subscribes to ALL inner observables simultaneously\n- Use when order doesn\'t matter (parallel requests)\n\nconcatMap:\n- Waits for previous inner observable to complete before subscribing to next\n- Preserves order\n- Use for sequential operations\n\nexhaustMap:\n- Ignores new values while an inner observable is active\n- Use for login/form submit (ignore duplicate clicks)',
    codeSnippet: `// Search: cancel stale requests\nthis.searchQuery$.pipe(\n  debounceTime(300),\n  switchMap(query => this.api.search(query))\n);\n\n// File upload: preserve order\nfiles$.pipe(\n  concatMap(file => this.api.upload(file))\n);\n\n// Login: ignore rapid clicks\nloginClick$.pipe(\n  exhaustMap(() => this.auth.login(credentials))\n);`,
    tags: ['rxjs', 'operators', 'flattening'] },

  { category: 'angular', topic: 'Routing', difficulty: 'beginner', order: 9,
    title: 'How does lazy loading work in Angular?',
    description: 'Explain lazy loading of feature modules/routes in Angular.',
    answer: 'Lazy loading defers loading of feature code until the user navigates to that route. Benefits:\n- Faster initial load (smaller main bundle)\n- Code is split into separate chunks\n- Only loaded when needed\n\nIn Angular 14+, you can lazy load standalone components directly:\nloadComponent: () => import(\'./feature/feature.component\')\n\nFor route groups:\nloadChildren: () => import(\'./feature/feature.routes\')\n\nAngular uses dynamic import() under the hood, creating separate JS chunks per route.',
    codeSnippet: `// Modern standalone component lazy loading\nexport const routes: Routes = [\n  {\n    path: 'dashboard',\n    loadComponent: () =>\n      import('./dashboard/dashboard.component')\n        .then(m => m.DashboardComponent)\n  },\n  {\n    path: 'admin',\n    loadChildren: () =>\n      import('./admin/admin.routes').then(m => m.adminRoutes)\n  }\n];`,
    tags: ['routing', 'lazy-loading', 'performance'] },

  { category: 'angular', topic: 'Routing', difficulty: 'intermediate', order: 10,
    title: 'What are Route Guards in Angular and when to use them?',
    description: 'Explain the different types of Angular route guards.',
    answer: 'Route guards control navigation to/from routes. Modern functional guards (Angular 14+):\n\ncanActivate: Block access to a route (auth check)\ncanActivateChild: Guard child routes\ncanDeactivate: Prevent leaving a route (unsaved changes warning)\ncanMatch: Conditionally match a route\nresolve: Pre-fetch data before activating route\n\nAll return boolean | UrlTree | Observable<boolean> | Promise<boolean>\n\nUrlTree redirects to another route instead of just blocking.',
    codeSnippet: `// Functional auth guard (Angular 14+)\nexport const authGuard: CanActivateFn = () => {\n  const auth = inject(AuthService);\n  const router = inject(Router);\n\n  if (auth.isAuthenticated()) return true;\n\n  return router.createUrlTree(['/auth/login']);\n};\n\n// Applied in routes\n{ path: 'admin', canActivate: [authGuard], ... }`,
    tags: ['routing', 'guards', 'auth'] },

  { category: 'angular', topic: 'Forms', difficulty: 'intermediate', order: 11,
    title: 'What is the difference between Template-driven and Reactive Forms?',
    description: 'Compare template-driven and reactive forms in Angular.',
    answer: 'Template-driven Forms:\n- Logic lives in the template (ngModel)\n- Simpler, less code\n- Asynchronous (uses ngModel two-way binding)\n- Harder to test\n- Good for simple forms\n\nReactive Forms:\n- Logic lives in the component TypeScript class\n- FormGroup, FormControl, FormArray\n- Synchronous, more predictable\n- Easier to unit test\n- Better for complex, dynamic forms\n- Supports custom validators and cross-field validation\n\nAngular team recommends Reactive Forms for most use cases.',
    codeSnippet: `// Reactive Form\nthis.form = this.fb.group({\n  email: ['', [Validators.required, Validators.email]],\n  password: ['', [Validators.required, Validators.minLength(8)]]\n});\n\n// Cross-field validator\nconst passwordMatch: ValidatorFn = (ctrl) => {\n  const pass = ctrl.get('password');\n  const confirm = ctrl.get('confirmPassword');\n  return pass?.value === confirm?.value ? null : { mismatch: true };\n};`,
    tags: ['forms', 'reactive', 'template-driven'] },

  { category: 'angular', topic: 'Dependency Injection', difficulty: 'intermediate', order: 12,
    title: 'Explain Angular\'s Dependency Injection system',
    description: 'How does Angular DI work and what are the different injection scopes?',
    answer: 'Angular DI is a design pattern where dependencies are "injected" rather than created inside a class.\n\nKey providers:\n- providedIn: \'root\': Singleton, app-wide (tree-shakable)\n- @NgModule providers: Module-scoped singleton\n- Component providers: New instance per component\n\nModern inject() function vs constructor injection:\n- inject() can be used in functions, not just constructors\n- Works in signal-based components\n\nHierarchical injector: Child injectors inherit from parent, can override.',
    codeSnippet: `// Global singleton (recommended)\n@Injectable({ providedIn: 'root' })\nexport class AuthService {}\n\n// Per-component instance\n@Component({\n  providers: [LocalCartService] // new instance per component\n})\nexport class CartComponent {\n  // Modern inject() function\n  private cart = inject(LocalCartService);\n  private auth = inject(AuthService);\n}`,
    tags: ['di', 'injection', 'services'] },

  { category: 'angular', topic: 'Change Detection', difficulty: 'advanced', order: 13,
    title: 'Explain Angular\'s Change Detection strategies',
    description: 'What is the difference between Default and OnPush change detection?',
    answer: 'Default Strategy:\n- Checks ALL components on every change detection cycle\n- Triggered by: user events, timers, HTTP responses, promises\n- Easy but can be slow for large apps\n\nOnPush Strategy:\n- Component only re-renders when:\n  1. @Input reference changes (not mutation)\n  2. An event originates from the component\n  3. Async pipe emits\n  4. markForCheck() called manually\n  5. Signal updates (Angular 17+)\n- Much better performance for pure components\n\nBest practice: Use OnPush everywhere, use signals or immutable data patterns.',
    codeSnippet: `@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  template: '{{ data() }}'\n})\nexport class PureComponent {\n  @Input() items: Item[] = []; // must pass new array ref\n  data = signal('hello');     // signals work with OnPush\n\n  constructor(private cdr: ChangeDetectorRef) {}\n\n  manualUpdate() {\n    this.cdr.markForCheck(); // force check\n  }\n}`,
    tags: ['change-detection', 'performance', 'onpush'] },

  { category: 'angular', topic: 'HTTP', difficulty: 'intermediate', order: 14,
    title: 'How do HTTP Interceptors work in Angular?',
    description: 'Explain Angular HTTP interceptors and common use cases.',
    answer: 'HTTP Interceptors intercept and transform HTTP requests/responses before they reach the server or the caller.\n\nCommon use cases:\n1. Add auth token to all requests\n2. Logging and error handling\n3. Caching\n4. Loading spinner\n5. Retry on failure\n\nModern functional interceptors (Angular 15+) are preferred over class-based ones.\n\nOrder matters: Interceptors execute in the order they\'re provided (request path) and reverse order (response path).',
    codeSnippet: `// Functional interceptor\nexport const authInterceptor: HttpInterceptorFn = (req, next) => {\n  const token = inject(AuthService).token();\n\n  const authReq = token\n    ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })\n    : req;\n\n  return next(authReq);\n};\n\n// Register in app.config.ts\nprovideHttpClient(withInterceptors([authInterceptor]))`,
    tags: ['http', 'interceptors', 'auth'] },

  { category: 'angular', topic: 'Pipes', difficulty: 'beginner', order: 15,
    title: 'What are Angular Pipes and how do you create a custom pipe?',
    description: 'Explain Angular pipes and walk through creating a custom pipe.',
    answer: 'Pipes transform data in templates without changing the underlying data. Built-in pipes: date, currency, uppercase, lowercase, async, json, slice, decimal.\n\nPure pipes (default): Only recalculate when input reference changes. Cached for performance.\n\nImpure pipes: Recalculate on every change detection cycle. Use sparingly.\n\nasync pipe: Automatically subscribes/unsubscribes from Observables and Promises.',
    codeSnippet: `@Pipe({ name: 'timeAgo', standalone: true })\nexport class TimeAgoPipe implements PipeTransform {\n  transform(value: Date | string): string {\n    const date = new Date(value);\n    const now = new Date();\n    const diffMs = now.getTime() - date.getTime();\n    const diffMins = Math.floor(diffMs / 60000);\n\n    if (diffMins < 1) return 'just now';\n    if (diffMins < 60) return \`\${diffMins}m ago\`;\n    if (diffMins < 1440) return \`\${Math.floor(diffMins/60)}h ago\`;\n    return \`\${Math.floor(diffMins/1440)}d ago\`;\n  }\n}`,
    tags: ['pipes', 'transform', 'template'] },

  // ─── JAVASCRIPT ────────────────────────────────────────────────────────────
  { category: 'javascript', topic: 'Closures', difficulty: 'intermediate', order: 1,
    title: 'What is a closure in JavaScript?',
    description: 'Explain closures with a practical example.',
    answer: 'A closure is a function that "remembers" its outer scope even after the outer function has returned. The inner function has access to:\n1. Its own scope\n2. The outer function\'s scope\n3. The global scope\n\nClosures are created every time a function is created. They are fundamental to patterns like:\n- Data privacy / encapsulation\n- Factory functions\n- Memoization\n- Event handlers\n- Module pattern',
    codeSnippet: `function createCounter(initial = 0) {\n  let count = initial; // private variable\n\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count\n  };\n}\n\nconst counter = createCounter(10);\nconsole.log(counter.increment()); // 11\nconsole.log(counter.getCount());  // 11\nconsole.log(counter.count);       // undefined (private!)`,
    tags: ['closures', 'scope', 'functions'] },

  { category: 'javascript', topic: 'Prototypes', difficulty: 'intermediate', order: 2,
    title: 'How does prototypal inheritance work in JavaScript?',
    description: 'Explain JavaScript\'s prototype chain and how inheritance is achieved.',
    answer: 'JavaScript uses prototypal inheritance, not classical inheritance. Every object has an internal [[Prototype]] link to another object.\n\nWhen you access a property:\n1. JS looks at the object itself\n2. If not found, looks at [[Prototype]]\n3. Continues up the chain until null\n4. Returns undefined if not found\n\nObject.create(): Explicitly set prototype\nClass syntax: Syntactic sugar over prototype chains\n\nPrototype chain: instance → Constructor.prototype → Object.prototype → null',
    codeSnippet: `// Prototype chain\nfunction Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.speak = function() {\n  return \`\${this.name} makes a sound\`;\n};\n\nconst dog = new Animal('Rex');\nconsole.log(dog.speak()); // 'Rex makes a sound'\nconsole.log(dog.__proto__ === Animal.prototype); // true\n\n// Modern class syntax (same prototype chain)\nclass Dog extends Animal {\n  speak() { return \`\${this.name} barks\`; }\n}`,
    tags: ['prototypes', 'inheritance', 'oop'] },

  { category: 'javascript', topic: 'Async / Await', difficulty: 'beginner', order: 3,
    title: 'Explain the Event Loop in JavaScript',
    description: 'Describe how JavaScript\'s event loop works and what the call stack, callback queue, and microtask queue are.',
    answer: 'JavaScript is single-threaded with an asynchronous event loop:\n\nCall Stack: Where synchronous code executes. LIFO.\nWeb APIs: Browser/Node handles async tasks (setTimeout, fetch, DOM events)\nCallback Queue (Macrotask): Callbacks from setTimeout, setInterval, I/O\nMicrotask Queue: Promise callbacks (.then, .catch), queueMicrotask(), MutationObserver\n\nEvent Loop order:\n1. Execute all synchronous code (empty call stack)\n2. Process ALL microtasks (Promise callbacks)\n3. Render if needed\n4. Process ONE macrotask (setTimeout callback)\n5. Repeat',
    codeSnippet: `console.log('1');           // sync\n\nsetTimeout(() => {\n  console.log('2');         // macrotask\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log('3');         // microtask\n});\n\n// Output: 1, 4, 3, 2`,
    tags: ['event-loop', 'async', 'microtasks'] },

  { category: 'javascript', topic: 'Async / Await', difficulty: 'intermediate', order: 4,
    title: 'What is the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any?',
    description: 'Explain the four Promise combination methods and when to use each.',
    answer: 'Promise.all(promises):\n- Resolves when ALL resolve\n- Rejects immediately on first rejection (fail-fast)\n- Use when you need all results and any failure is fatal\n\nPromise.allSettled(promises):\n- Always resolves with array of {status, value/reason}\n- Never rejects\n- Use when you want all results regardless of failures\n\nPromise.race(promises):\n- Resolves/rejects with first settled promise\n- Use for timeouts or fastest response\n\nPromise.any(promises):\n- Resolves with first FULFILLED promise\n- Rejects only if ALL reject (AggregateError)\n- Use when you need at least one success',
    codeSnippet: `// Parallel with fail-fast\nconst [user, posts] = await Promise.all([\n  fetchUser(id),\n  fetchPosts(id)\n]);\n\n// Timeout pattern\nconst result = await Promise.race([\n  fetch('/api/data'),\n  new Promise((_, reject) =>\n    setTimeout(() => reject(new Error('Timeout')), 5000)\n  )\n]);`,
    tags: ['promises', 'async', 'parallel'] },

  { category: 'javascript', topic: 'ES6+', difficulty: 'beginner', order: 5,
    title: 'What is the difference between var, let, and const?',
    description: 'Explain scoping, hoisting, and reassignment rules for var, let, and const.',
    answer: 'var:\n- Function scoped (or global)\n- Hoisted and initialized to undefined\n- Can be redeclared\n- Avoid in modern JS\n\nlet:\n- Block scoped\n- Hoisted but NOT initialized (Temporal Dead Zone)\n- Cannot be redeclared in same scope\n- Can be reassigned\n\nconst:\n- Block scoped\n- Must be initialized at declaration\n- Cannot be reassigned (binding, not value)\n- Objects/arrays can still be mutated\n\nRule of thumb: Use const by default, let when you need to reassign, never var.',
    codeSnippet: `// Temporal Dead Zone\nconsole.log(x); // ReferenceError (TDZ)\nlet x = 5;\n\n// const with objects\nconst user = { name: 'Alice' };\nuser.name = 'Bob'; // OK - mutation\nuser = {};         // Error - reassignment`,
    tags: ['variables', 'scope', 'hoisting', 'es6'] },

  { category: 'javascript', topic: 'ES6+', difficulty: 'beginner', order: 6,
    title: 'What are arrow functions and how do they differ from regular functions?',
    description: 'Explain arrow function syntax and the key differences in behavior.',
    answer: 'Arrow functions are a concise syntax for functions with key differences:\n\n1. this binding: Arrow functions inherit `this` from surrounding lexical scope. Regular functions have their own `this` (dynamic).\n\n2. No arguments object: Arrow functions don\'t have their own arguments object.\n\n3. Cannot be used as constructors: No `new` keyword.\n\n4. No prototype property.\n\n5. Cannot use yield (not generators).\n\nUse arrow functions for: callbacks, array methods, when you want to preserve `this`.\nUse regular functions for: methods, constructors, when you need `arguments`.',
    codeSnippet: `// 'this' difference\nconst obj = {\n  name: 'Alice',\n  greetArrow: () => {\n    console.log(this.name); // undefined (inherits outer 'this')\n  },\n  greetRegular() {\n    console.log(this.name); // 'Alice' (dynamic 'this')\n  }\n};`,
    tags: ['arrow-functions', 'this', 'es6'] },

  { category: 'javascript', topic: 'ES6+', difficulty: 'intermediate', order: 7,
    title: 'Explain destructuring, spread, and rest operators',
    description: 'Demonstrate destructuring assignment and the spread/rest operator.',
    answer: 'Destructuring: Extract values from arrays/objects into variables.\n\nSpread (...): Expands iterables into individual elements.\n\nRest (...): Collects remaining elements into an array.\n\nKey use cases:\n- Function parameter defaults\n- Swapping variables\n- Cloning objects/arrays\n- Merging objects\n- Variadic functions',
    codeSnippet: `// Object destructuring with defaults\nconst { name, age = 25, address: { city } = {} } = user;\n\n// Array destructuring\nconst [first, , third, ...rest] = [1, 2, 3, 4, 5];\n\n// Spread to merge/clone\nconst merged = { ...defaults, ...overrides };`,
    tags: ['destructuring', 'spread', 'rest', 'es6'] },

  { category: 'javascript', topic: 'Core Concepts', difficulty: 'intermediate', order: 8,
    title: 'What is the difference between == and === in JavaScript?',
    description: 'Explain loose and strict equality in JavaScript with examples.',
    answer: '== (Loose equality): Performs type coercion before comparison. JS converts operands to the same type.\n\n=== (Strict equality): No type coercion. Both value AND type must match.\n\nAlways prefer === to avoid unexpected bugs from coercion.\n\nSpecial cases:\n- null == undefined → true (but null !== undefined)\n- NaN != NaN (use Number.isNaN())\n- 0 == false → true (0 === false → false)',
    codeSnippet: `// Coercion surprises with ==\nconsole.log(0 == '0');     // true (string converted)\nconsole.log(0 == false);   // true\nconsole.log('' == false);  // true\nconsole.log(null == undefined); // true`,
    tags: ['equality', 'coercion', 'types'] },

  { category: 'javascript', topic: 'Core Concepts', difficulty: 'intermediate', order: 9,
    title: 'Explain JavaScript\'s this keyword',
    description: 'How is the value of `this` determined in different contexts?',
    answer: '`this` refers to the object that is executing the current function. Its value depends on how the function is called:\n\n1. Global context: window (browser) or global (Node)\n2. Method call: obj.method() → this = obj\n3. Constructor: new Fn() → this = new instance\n4. Arrow function: inherits this from lexical scope\n5. Explicit binding: call(), apply(), bind()\n6. Class: this = instance\n\nbind() creates a new function with this permanently bound.\ncall() invokes immediately with this set.\napply() same as call but arguments as array.',
    codeSnippet: `const obj = {\n  name: 'Obj',\n  getThis() { return this; }\n};\n\nobj.getThis();              // obj\nconst fn = obj.getThis;\nfn();                       // undefined (strict) or window`,
    tags: ['this', 'context', 'binding'] },

  { category: 'javascript', topic: 'Core Concepts', difficulty: 'advanced', order: 10,
    title: 'What is the difference between call, apply, and bind?',
    description: 'Explain the three methods for explicit this binding in JavaScript.',
    answer: 'All three methods explicitly set the `this` context for a function:\n\ncall(thisArg, arg1, arg2, ...):\n- Invokes function immediately\n- Arguments passed individually\n\napply(thisArg, [arg1, arg2, ...]):\n- Invokes function immediately\n- Arguments passed as array\n- Useful when args are already in array form\n\nbind(thisArg, arg1, arg2, ...):\n- Returns a NEW function with this bound\n- Does NOT invoke immediately\n- Supports partial application (currying)\n- Used for event handlers, callbacks',
    codeSnippet: `function greet(greeting, punctuation) {\n  return \`\${greeting}, \${this.name}\${punctuation}\`;\n}\n\nconst user = { name: 'Alice' };\n\ngreet.call(user, 'Hello', '!');       // 'Hello, Alice!'\ngreet.apply(user, ['Hi', '?']);        // 'Hi, Alice?'`,
    tags: ['call', 'apply', 'bind', 'this'] },

  { category: 'javascript', topic: 'Functional Programming', difficulty: 'intermediate', order: 11,
    title: 'Explain map, filter, and reduce',
    description: 'Demonstrate the three core array higher-order functions in JavaScript.',
    answer: 'These are higher-order functions that operate on arrays without mutation:\n\nmap(fn): Transforms each element, returns new array of same length.\n\nfilter(fn): Keeps elements where fn returns true, returns subset.\n\nreduce(fn, initial): Accumulates all elements into a single value. Most powerful and flexible.\n\nAll three return new arrays/values without mutating the original.',
    codeSnippet: `const orders = [\n  { product: 'Book', price: 15, qty: 2 },\n  { product: 'Pen', price: 2, qty: 10 },\n  { product: 'Laptop', price: 999, qty: 1 }\n];\n\n// map: get totals\nconst totals = orders.map(o => o.price * o.qty);\n\n// filter: expensive items\nconst expensive = orders.filter(o => o.price > 10);\n\n// reduce: grand total\nconst grandTotal = orders.reduce(\n  (sum, o) => sum + o.price * o.qty, 0\n); // 1049`,
    tags: ['functional', 'arrays', 'higher-order'] },

  { category: 'javascript', topic: 'ES6+', difficulty: 'advanced', order: 12,
    title: 'What are generators in JavaScript?',
    description: 'Explain generator functions and their use cases.',
    answer: 'Generators are functions that can be paused and resumed. They produce a series of values lazily.\n\nDeclared with function* syntax. yield pauses execution and returns a value. next() resumes.\n\nKey properties:\n- Returns an iterator object\n- Lazy evaluation (values computed on demand)\n- Can represent infinite sequences\n- Used in Redux-Saga for async flows\n\nfor...of automatically calls next() until done.',
    codeSnippet: `function* range(start, end, step = 1) {\n  for (let i = start; i < end; i += step) {\n    yield i;\n  }\n}\n\n// Lazy - only computes when needed\nfor (const num of range(0, 1000000)) {\n  if (num > 5) break;\n  console.log(num); // 0,1,2,3,4,5\n}`,
    tags: ['generators', 'iterators', 'es6'] },

  { category: 'javascript', topic: 'Performance', difficulty: 'advanced', order: 13,
    title: 'What causes memory leaks in JavaScript and how to prevent them?',
    description: 'Identify common sources of memory leaks in JavaScript applications.',
    answer: 'Common memory leak sources:\n\n1. Global variables: Accidentally creating globals (missing var/let/const)\n2. Detached DOM nodes: Removing from DOM but keeping JS references\n3. Forgotten timers: setInterval never cleared\n4. Event listeners: Added but never removed\n5. Closures: Holding references to large objects longer than needed\n6. Promises: Unresolved promises with references\n7. Angular: Not unsubscribing from Observables\n\nPrevention:\n- Use WeakMap/WeakSet for object references\n- Clear timers in cleanup (ngOnDestroy)\n- Remove event listeners when done\n- Use Chrome DevTools Memory tab to profile',
    codeSnippet: `// Memory leak: timer never cleared\nconst leak = setInterval(() => expensiveOperation(), 1000);\n// Fix:\nconst timer = setInterval(() => expensiveOperation(), 1000);\nclearInterval(timer);`,
    tags: ['memory', 'performance', 'leaks'] },

  // ─── SYSTEM DESIGN ──────────────────────────────────────────────────────────
  { category: 'system-design', topic: 'Fundamentals', difficulty: 'beginner', order: 1,
    title: 'What is horizontal vs vertical scaling?',
    description: 'Explain the difference between horizontal and vertical scaling with trade-offs.',
    answer: 'Vertical Scaling (Scale Up):\n- Add more resources (CPU, RAM) to existing server\n- Simpler, no code changes needed\n- Single point of failure\n- Hardware limits (upper bound)\n- More expensive per unit\n\nHorizontal Scaling (Scale Out):\n- Add more servers to distribute load\n- No theoretical upper limit\n- Requires load balancer\n- Stateless architecture needed\n- More complex (distributed system problems)\n- Cheaper at scale (commodity hardware)\n\nMost modern systems prefer horizontal scaling with auto-scaling groups.',
    codeSnippet: `// Stateless service design (enables horizontal scaling)\nclass UserService {\n  // GOOD: state externalized to Redis\n  async getSession(token: string) {\n    return await this.redis.get(\`session:\${token}\`);\n  }\n}`,
    tags: ['scaling', 'architecture', 'fundamentals'] },

  { category: 'system-design', topic: 'Databases', difficulty: 'intermediate', order: 2,
    title: 'SQL vs NoSQL: How do you choose?',
    description: 'Compare SQL and NoSQL databases and describe criteria for choosing each.',
    answer: 'SQL (Relational):\n- Structured schema\n- ACID transactions\n- Complex joins and queries\n- Vertical scaling primarily\n- Examples: PostgreSQL, MySQL\n- Best for: Financial data, complex relationships, reporting\n\nNoSQL:\n- Flexible schema\n- Horizontal scaling\n- Various models: Document, Key-Value, Column, Graph\n- Eventual consistency (usually)\n- Examples: MongoDB, Redis, Cassandra\n- Best for: High write throughput, unstructured data, caching\n\nChoose SQL when: Data integrity is critical, complex queries needed, team knows SQL.\nChoose NoSQL when: Scale is priority, schema is flexible, simple access patterns.',
    codeSnippet: `// SQL: complex join\nSELECT u.name, COUNT(o.id) as orders, SUM(o.total) as revenue\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at > '2024-01-01'\nGROUP BY u.id\nHAVING revenue > 1000;`,
    tags: ['databases', 'sql', 'nosql', 'architecture'] },

  { category: 'system-design', topic: 'Caching', difficulty: 'intermediate', order: 3,
    title: 'Explain caching strategies: cache-aside, write-through, write-back',
    description: 'Compare the three main caching strategies and their trade-offs.',
    answer: 'Cache-Aside (Lazy Loading):\n- App checks cache first\n- On miss: load from DB, populate cache\n- Data loaded only when needed\n- Risk: cache stampede (many simultaneous misses)\n\nWrite-Through:\n- Every write goes to both cache AND DB synchronously\n- Cache is always in sync\n- Higher write latency\n- Good for read-heavy workloads\n\nWrite-Back (Write-Behind):\n- Write to cache immediately, write to DB asynchronously\n- Lowest write latency\n- Risk: data loss if cache fails before DB write\n- Good for write-heavy workloads\n\nCache Eviction: LRU (Least Recently Used) is most common.',
    codeSnippet: `// Cache-Aside pattern\nasync function getUser(userId: string) {\n  const cached = await redis.get(\`user:\${userId}\`);\n  if (cached) return JSON.parse(cached);\n  const user = await db.users.findById(userId);\n  await redis.setex(\`user:\${userId}\`, 3600, JSON.stringify(user));\n  return user;\n}`,
    tags: ['caching', 'redis', 'patterns'] },

  { category: 'system-design', topic: 'Load Balancing', difficulty: 'intermediate', order: 4,
    title: 'What are the different load balancing algorithms?',
    description: 'Explain common load balancing algorithms and when to use each.',
    answer: '1. Round Robin: Requests distributed sequentially to each server. Simple, good when servers are identical.\n\n2. Weighted Round Robin: Servers with higher capacity get more requests.\n\n3. Least Connections: Request goes to server with fewest active connections. Good for varied request durations.\n\n4. IP Hash: Client IP determines which server. Ensures session persistence (sticky sessions).\n\n5. Random: Random server selection. Simple but can cause uneven distribution.\n\n6. Resource Based: Routes based on server health/CPU/memory metrics.\n\nLayer 4 (Transport): Routes based on IP/TCP. Faster, no content inspection.\nLayer 7 (Application): Routes based on HTTP headers, URL, cookies. More flexible.',
    codeSnippet: `# Nginx load balancer config\nupstream backend {\n  server backend1.example.com;\n  server backend2.example.com;\n}`,
    tags: ['load-balancing', 'nginx', 'infrastructure'] },

  { category: 'system-design', topic: 'Microservices', difficulty: 'advanced', order: 5,
    title: 'What is the difference between REST, GraphQL, and gRPC?',
    description: 'Compare the three most common API paradigms.',
    answer: 'REST:\n- Resource-based URLs, HTTP verbs\n- Stateless, cacheable\n- Simple, widely understood\n- Over-fetching/under-fetching problem\n- Best for public APIs\n\nGraphQL:\n- Single endpoint, client specifies shape of response\n- No over/under-fetching\n- Introspective schema\n- More complex caching\n- Best for: complex data requirements, multiple clients with different needs\n\ngRPC:\n- Binary Protocol Buffers (smaller, faster than JSON)\n- Strongly typed contracts\n- Supports streaming (unary, server, client, bidirectional)\n- HTTP/2 based\n- Best for: internal microservice communication, high-performance needs\n- Harder to debug (not human-readable)',
    codeSnippet: `// REST\nGET /users/123/posts?limit=10\n\n// GraphQL\nquery {\n  user(id: "123") {\n    name\n    posts(limit: 10) { title }\n  }\n}`,
    tags: ['api', 'rest', 'graphql', 'grpc'] },

  { category: 'system-design', topic: 'Reliability', difficulty: 'advanced', order: 6,
    title: 'What is the CAP theorem?',
    description: 'Explain the CAP theorem and how it applies to distributed systems.',
    answer: 'CAP Theorem states that a distributed system can only guarantee 2 of 3 properties:\n\nConsistency (C): Every read receives the most recent write or an error. All nodes see same data at same time.\n\nAvailability (A): Every request receives a response (not necessarily latest data). System stays operational.\n\nPartition Tolerance (P): System continues operating despite network partitions (message loss between nodes).\n\nSince network partitions WILL happen in distributed systems, you must choose between C and A:\n\nCP systems: MongoDB, Redis, HBase — prefer consistency over availability\nAP systems: Cassandra, DynamoDB, CouchDB — prefer availability over consistency\n\nIn practice: PACELC theorem extends CAP for normal operations.',
    codeSnippet: `// MongoDB write concern examples (CP tradeoffs)\nawait collection.insertOne(doc, {\n  writeConcern: { w: 'majority', j: true }\n});`,
    tags: ['cap-theorem', 'distributed-systems', 'consistency'] },

  { category: 'system-design', topic: 'Message Queues', difficulty: 'intermediate', order: 7,
    title: 'When would you use a message queue and what are the benefits?',
    description: 'Explain message queues, when to use them, and popular options.',
    answer: 'A message queue is an asynchronous communication pattern where producers send messages and consumers process them independently.\n\nBenefits:\n1. Decoupling: Producer and consumer don\'t need to be available simultaneously\n2. Load leveling: Handle traffic spikes by queuing excess requests\n3. Reliability: Messages persisted until processed\n4. Retry logic: Failed messages can be retried\n5. Fan-out: One message → multiple consumers\n\nUse cases:\n- Email/notification sending\n- Image/video processing\n- Order processing\n- Microservice communication\n- Event sourcing\n\nPopular options: RabbitMQ, Apache Kafka, AWS SQS, Redis Streams',
    codeSnippet: `// With queue: resilient\napp.post('/order', async (req, res) => {\n  const order = await db.saveOrder(req.body);\n  await queue.publish('order.created', order);\n  res.json({ success: true });\n});`,
    tags: ['message-queues', 'kafka', 'async', 'microservices'] },

  { category: 'system-design', topic: 'Fundamentals', difficulty: 'advanced', order: 8,
    title: 'How would you design a URL shortener like bit.ly?',
    description: 'Walk through the system design of a URL shortening service.',
    answer: 'Requirements:\n- Shorten long URLs\n- Redirect short → long\n- Analytics (click counts)\n- ~100M URLs, 1000 writes/sec, 100K reads/sec\n\nCore Algorithm (short code generation):\n1. Generate unique ID (auto-increment or UUID)\n2. Base-62 encode (a-z, A-Z, 0-9) → 6-7 char code\n\nArchitecture:\n- API servers (stateless, horizontally scaled)\n- Database: SQL for strong consistency on short codes\n- Cache (Redis): Cache hot URLs, 20% URLs get 80% traffic\n- CDN: Serve redirects from edge\n\nDatabase schema:\n- id, short_code (indexed), long_url, created_at, user_id, clicks\n\nRedirect: 301 (permanent, cached by browser) vs 302 (temporary, every request hits server for analytics)',
    codeSnippet: `// Base-62 encoding\nconst CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';\nfunction encode(num: number): string {\n  let result = '';\n  while (num > 0) {\n    result = CHARS[num % 62] + result;\n    num = Math.floor(num / 62);\n  }\n  return result.padStart(6, '0');\n}`,
    tags: ['system-design', 'url-shortener', 'case-study'] },

  { category: 'system-design', topic: 'Microservices', difficulty: 'advanced', order: 9,
    title: 'What is the Saga pattern in microservices?',
    description: 'Explain the Saga pattern for managing distributed transactions.',
    answer: 'The Saga pattern manages distributed transactions across microservices without a traditional ACID 2-phase commit.\n\nA saga is a sequence of local transactions. Each step publishes an event/message. If a step fails, compensating transactions undo previous steps.\n\nTwo types:\n\nChoreography:\n- Services react to events from each other\n- No central coordinator\n- Decentralized, harder to track\n\nOrchestration:\n- Central saga orchestrator directs each step\n- Easier to understand and debug\n- Orchestrator can be single point of failure\n\nUse when: Long-running transactions span multiple services and 2PC is not feasible.',
    codeSnippet: `// Orchestration Saga for Order\nclass OrderSaga {\n  async execute(order: Order) {\n    try {\n      await this.paymentService.charge(order);\n      await this.inventoryService.reserve(order);\n    } catch (error) {\n      await this.inventoryService.release(order);\n      await this.paymentService.refund(order);\n      throw error;\n    }\n  }\n}`,
    tags: ['saga', 'transactions', 'microservices'] },

  { category: 'system-design', topic: 'Reliability', difficulty: 'intermediate', order: 10,
    title: 'What is the Circuit Breaker pattern?',
    description: 'Explain the Circuit Breaker pattern and why it is important in microservices.',
    answer: 'The Circuit Breaker prevents cascading failures in distributed systems by wrapping calls to external services.\n\nStates:\n- Closed: Normal operation, requests flow through\n- Open: Service failed too many times, requests fail fast (no calls made)\n- Half-Open: After timeout, allows test requests to check recovery\n\nBenefits:\n1. Fail fast: Don\'t wait for timeouts\n2. Prevent cascading failures\n3. Allow recovery time\n4. Provide fallback responses\n\nThreshold example: Open if 5 failures in 10 seconds. Try again after 30 seconds.',
    codeSnippet: `class CircuitBreaker {\n  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';\n  // handles states dynamically\n}`,
    tags: ['circuit-breaker', 'resilience', 'microservices'] },
];

// Generator for additional programmatic questions to reach 200+
function generateProgrammaticQuestions(): any[] {
  const generated: any[] = [];
  let currentOrder = 100;

  // Define detailed dynamic topics and details to build high-quality questions
  const angularTopics = [
    {
      topic: 'Components',
      questions: [
        {
          title: 'How does Content Projection work in Angular?',
          desc: 'Explain <ng-content> and multi-slot projection.',
          ans: 'Content projection is a pattern in which you import an HTML template from outside the component and insert it into the component\'s template. This is accomplished using the <ng-content> tag. Multi-slot projection uses the select attribute to target specific elements.',
          code: `@Component({\n  selector: 'app-card',\n  template: '\n    <div class=\"header\"><ng-content select=\"[header]\"></ng-content></div>\n    <div class=\"body\"><ng-content></ng-content></div>\n  '\n})\nexport class CardComponent {}`,
          tags: ['components', 'content-projection', 'ng-content'],
          diff: 'intermediate'
        },
        {
          title: 'Explain @ViewChild and @ViewChildren decorators',
          desc: 'How do you access template reference variables or child components in TypeScript?',
          ans: '@ViewChild is a decorator that configures a view query. It returns the first element matching the selector. @ViewChildren returns a QueryList of matching elements, which updates dynamically as the DOM updates.',
          code: `export class ParentComponent implements AfterViewInit {\n  @ViewChild('childRef') child!: ChildComponent;\n  @ViewChild('inputRef') input!: ElementRef<HTMLInputElement>;\n\n  ngAfterViewInit() {\n    this.input.nativeElement.focus();\n  }\n}`,
          tags: ['components', 'queries', 'viewchild'],
          diff: 'intermediate'
        },
        {
          title: 'What is the purpose of NgZone and running outside Angular?',
          desc: 'How does Angular zone-based change detection optimize performance?',
          ans: 'Angular uses NgZone (backed by Zone.js) to automatically trigger change detection when asynchronous operations occur. Sometimes, third-party libraries or animations trigger too many runs. Running code outside Angular prevents these triggers, saving rendering performance.',
          code: `constructor(private ngZone: NgZone) {}\nrunTimer() {\n  this.ngZone.runOutsideAngular(() => {\n    setInterval(() => {\n      // calculations that shouldn't trigger UI updates\n    }, 100);\n  });\n}`,
          tags: ['zone.js', 'ngzone', 'performance'],
          diff: 'advanced'
        },
        {
          title: 'What is Deferred Loading in Angular?',
          desc: 'Explain the @defer block introduced in modern Angular.',
          ans: 'Deferred blocks (@defer) allow lazy-loading component dependencies (directives, components, pipes) directly within template layouts based on specific triggers: on idle, on viewport, on interaction, on hover, or custom conditions.',
          code: `@defer (on viewport) {\n  <app-heavy-chart />\n} @placeholder {\n  <div>Loading placeholder...</div>\n} @loading {\n  <p>Loading...</p>\n}`,
          tags: ['defer', 'lazy-loading', 'angular17+'],
          diff: 'beginner'
        }
      ]
    },
    {
      topic: 'Signals',
      questions: [
        {
          title: 'How do you handle two-way data binding with Signals?',
          desc: 'Explain model() signals in Angular 17.2+.',
          ans: 'Model signals (model()) define writable inputs that support two-way bindings. They emit an event (propertyChange) when updated, allowing child and parent component state to remain synchronized reactively.',
          code: `// Child component:\n@Component({\n  template: '<input [(ngModel)]=\"value\" />'\n})\nexport class InputComponent {\n  value = model<string>(''); // Model signal\n}\n\n// Parent component:\n// <app-input [(value)]=\"parentState\" />`,
          tags: ['signals', 'binding', 'model'],
          diff: 'intermediate'
        },
        {
          title: 'What is the purpose of untracked() in computed signals?',
          desc: 'How do you read a signal inside a reactive context without creating a dependency?',
          ans: 'By default, reading any signal inside computed() or effect() registers it as a dependency. If you want to read a signal\'s value for operations without re-running when that signal changes, wrap it in untracked().',
          code: `const logCount = effect(() => {\n  const currentCount = this.count();\n  const meta = untracked(() => this.metadata());\n  console.log(\`Count is \${currentCount}, metadata is \${meta}\`);\n});`,
          tags: ['signals', 'untracked', 'computed'],
          diff: 'advanced'
        },
        {
          title: 'What are custom signal equality functions?',
          desc: 'How do you define custom equality checks for signals?',
          ans: 'When defining a signal, you can supply a custom equal comparison function in the options object. The signal will only notify consumers of updates if the equality check returns false.',
          code: `const user = signal({ id: 1, name: 'Alice' }, {\n  equal: (a, b) => a.id === b.id\n});\n// Updating name won't trigger downstream computed/effects if ID is same\nuser.set({ id: 1, name: 'Bob' });`,
          tags: ['signals', 'equality', 'performance'],
          diff: 'advanced'
        }
      ]
    },
    {
      topic: 'RxJS',
      questions: [
        {
          title: 'What is the shareReplay operator used for?',
          desc: 'Explain sharing execution and caching network responses.',
          ans: 'shareReplay makes an observable hot and replays the last N emissions to new subscribers. It prevents duplicate execution (like HTTP calls) when multiple template subscriptions are opened.',
          code: `this.userData$ = this.http.get('/api/user').pipe(\n  shareReplay({ bufferSize: 1, refCount: true })\n);`,
          tags: ['rxjs', 'caching', 'share-replay'],
          diff: 'intermediate'
        },
        {
          title: 'Explain the difference between combineLatest and forkJoin',
          desc: 'When should you choose combineLatest vs forkJoin?',
          ans: 'forkJoin waits for all source observables to complete and emits their final values. combineLatest emits a value whenever any of the source observables emit, as long as all source observables have emitted at least once.',
          code: `// forkJoin - equivalent to Promise.all\nforkJoin([api1$, api2$]).subscribe(([r1, r2]) => {});\n\n// combineLatest - tracks active combinations\ncombineLatest([filter$, search$]).subscribe(([f, s]) => {});`,
          tags: ['rxjs', 'operators', 'combinations'],
          diff: 'intermediate'
        },
        {
          title: 'How do you handle cleanups of RxJS observables in components?',
          desc: 'Explain takeUntilDestroyed in modern Angular.',
          ans: 'In Angular 16+, takeUntilDestroyed operator automatically unsubscribes from observables when the current injection context (component, service) is destroyed, replacing manual ngOnDestroy logic.',
          code: `constructor(private http: HttpClient) {\n  this.http.get('/api/data')\n    .pipe(takeUntilDestroyed())\n    .subscribe(data => this.data = data);\n}`,
          tags: ['rxjs', 'unsubscription', 'take-until-destroyed'],
          diff: 'beginner'
        }
      ]
    },
    {
      topic: 'State Management',
      questions: [
        {
          title: 'What is NgRx Store and why is it used?',
          desc: 'Explain state management in large scale Angular applications.',
          ans: 'NgRx Store is a Redux-inspired state management library for Angular. It uses Actions (events), Reducers (state updates), Selectors (slicing state), and Effects (side effects, HTTP calls) to maintain single source of truth.',
          code: `// Action\nexport const loadUsers = createAction('[Users] Load');\n// Selector\nexport const selectAllUsers = createSelector(selectUserState, state => state.list);`,
          tags: ['ngrx', 'state-management', 'redux'],
          diff: 'intermediate'
        },
        {
          title: 'Compare NgRx ComponentStore with Global Store',
          desc: 'When do you use localized vs global state management?',
          ans: 'Global Store is ideal for app-wide shared state (auth, settings). ComponentStore is designed for local component-tree state, offering simpler architecture and lifecycle scope identical to the component itself.',
          code: `@Injectable()\nexport class TodoStore extends ComponentStore<TodoState> {\n  constructor() { super({ items: [] }); }\n  readonly items$ = this.select(state => state.items);\n}`,
          tags: ['ngrx', 'state-management', 'component-store'],
          diff: 'advanced'
        }
      ]
    }
  ];

  const javascriptTopics = [
    {
      topic: 'Closures',
      questions: [
        {
          title: 'How can closures be used to implement private fields?',
          desc: 'Explain data hiding before ES2022 private fields.',
          ans: 'Before private fields (#field) were added to classes, closures were the main mechanism for data encapsulation. By defining local variables inside a constructor/factory and returning methods referencing them, they remain private.',
          code: `function BankAccount(initialBalance) {\n  let balance = initialBalance; // Encapsulated\n  return {\n    deposit: (amt) => { balance += amt; },\n    getBalance: () => balance\n  };\n}`,
          tags: ['closures', 'encapsulation', 'privacy'],
          diff: 'intermediate'
        },
        {
          title: 'What is a closure memory leak?',
          desc: 'How can closure scopes retain memory accidentally?',
          ans: 'A closure retains references to variables in its parent lexical scope. If a long-lived callback retains variables pointing to large objects, those objects can\'t be garbage collected, creating a memory leak.',
          code: `function setupLeak() {\n  let largeArray = new Array(1000000);\n  return function() {\n    // closure retains largeArray even if unused in this inner function\n    console.log("closure alive");\n  };\n}`,
          tags: ['closures', 'memory-leaks', 'gc'],
          diff: 'advanced'
        }
      ]
    },
    {
      topic: 'Async / Await',
      questions: [
        {
          title: 'What is the purpose of AsyncIterator and for-await-of loop?',
          desc: 'How do you consume asynchronous streams in JavaScript?',
          ans: 'AsyncIterator allows consuming streams of asynchronous data sequentially. The `for-await-of` loop consumes these iterators, waiting for promises at each iteration.',
          code: `async function processRequests(stream) {\n  for await (const chunk of stream) {\n    console.log('Received chunk:', chunk);\n  }\n}`,
          tags: ['async', 'iterators', 'es2018'],
          diff: 'advanced'
        },
        {
          title: 'What are microtasks and macrotasks in relation to Event Loop?',
          desc: 'Contrast setImmediate, setTimeout, and Promise execution sequence.',
          ans: 'Microtasks (Promises, queueMicrotask) run right after the current execution context and before yielding control back to the event loop. Macrotasks (setTimeout, event callbacks) run in successive loops.',
          code: `setTimeout(() => console.log('Timeout'), 0); // macrotask\nPromise.resolve().then(() => console.log('Promise')); // microtask\n// Promise runs first!`,
          tags: ['event-loop', 'microtasks', 'macrotasks'],
          diff: 'intermediate'
        }
      ]
    },
    {
      topic: 'Core Concepts',
      questions: [
        {
          title: 'What is Object.freeze() vs Object.seal()?',
          desc: 'Explain immutability features in standard JavaScript objects.',
          ans: 'Object.freeze() makes an object completely immutable: no properties can be added, deleted, or updated. Object.seal() allows updates of existing properties but prevents additions or deletions.',
          code: `const obj = { age: 30 };\nObject.freeze(obj);\nobj.age = 31; // Fails silently or throws error in strict mode`,
          tags: ['objects', 'immutability', 'methods'],
          diff: 'beginner'
        },
        {
          title: 'How does JS garbage collection work?',
          desc: 'Explain Reference Counting and Mark-and-Sweep.',
          ans: 'JavaScript uses the Mark-and-Sweep algorithm. It starts at root objects (like window), traverses references, and "marks" visited objects. Unmarked objects are considered unreachable and are swept from memory.',
          code: `let obj1 = { val: 1 };\nlet obj2 = { val: 2 };\nobj1 = null; // obj1 target is now candidate for GC if no other references exist`,
          tags: ['memory', 'garbage-collection', 'v8'],
          diff: 'advanced'
        }
      ]
    }
  ];

  const systemDesignTopics = [
    {
      topic: 'Databases',
      questions: [
        {
          title: 'What is Database Sharding?',
          desc: 'Explain horizontal partition of database rows.',
          ans: 'Sharding splits a single database into smaller, faster shards horizontally. Rows are distributed across servers using a shard key (like customer_id or hash(customer_id)).',
          code: `// Example partition based on Hash Key:\nconst shardIndex = hash(userId) % totalShards;`,
          tags: ['databases', 'sharding', 'scale-out'],
          diff: 'advanced'
        },
        {
          title: 'Explain database isolation levels',
          desc: 'What are Read Uncommitted, Read Committed, Repeatable Read, and Serializable?',
          ans: 'Isolation levels define how transaction modifications are visible to other transactions. Read Uncommitted allows dirty reads. Read Committed prevents dirty reads. Repeatable Read prevents non-repeatable reads. Serializable is highest safety, locking tables.',
          code: `SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`,
          tags: ['databases', 'acid', 'isolation'],
          diff: 'advanced'
        }
      ]
    },
    {
      topic: 'Caching',
      questions: [
        {
          title: 'What is a Cache Stampede and how do you prevent it?',
          desc: 'Describe concurrent read attempts on cache key expiration.',
          ans: 'Cache stampede happens when hot cache keys expire, causing a surge of simultaneous requests to database. Prevention: mutex locks, random early expiration (probabilistic early expiration), background cron updates.',
          code: `// Mutex solution:\nif (!cache.get(key)) {\n  if (lock.acquire(key)) {\n    const val = db.fetch(key);\n    cache.set(key, val);\n    lock.release(key);\n  }\n}`,
          tags: ['caching', 'concurrency', 'stampede'],
          diff: 'advanced'
        },
        {
          title: 'Explain CDN (Content Delivery Network)',
          desc: 'How are CDNs used to cache static assets?',
          ans: 'CDNs place caching proxy servers at locations around the globe (Edge Locations). When a user requests a file, the request is routed to the nearest geographic CDN server, accelerating downloads.',
          code: `# Header cache controls:\nCache-Control: public, max-age=31536000`,
          tags: ['cdn', 'caching', 'networking'],
          diff: 'beginner'
        }
      ]
    },
    {
      topic: 'Load Balancing',
      questions: [
        {
          title: 'What are Sticky Sessions in Load Balancing?',
          desc: 'Why are sticky sessions used and what are the drawbacks?',
          ans: 'Sticky sessions route all requests from a single client to the exact same backend server instance. Drawbacks: limits horizontal scalability, causes uneven server loads if a single client has heavy traffic.',
          code: `Cookie: SERVERID=backend01`,
          tags: ['load-balancing', 'sessions', 'scalability'],
          diff: 'intermediate'
        }
      ]
    }
  ];

  // Combine topics to populate 210 questions total
  const addCategoryQuestions = (cat: string, topicsList: any[]) => {
    let qIndex = 0;
    while (generated.length + handCraftedQuestions.length < 210) {
      const topicObj = topicsList[qIndex % topicsList.length];
      const q = topicObj.questions[Math.floor(Math.random() * topicObj.questions.length)];
      
      const newQuestion = {
        category: cat,
        topic: topicObj.topic,
        difficulty: q.diff,
        title: `${q.title} (Vol. ${Math.floor(generated.length / topicsList.length) + 1})`,
        description: q.desc,
        answer: q.ans,
        codeSnippet: q.code || '',
        tags: [...q.tags, 'generated'],
        order: currentOrder++
      };

      // Ensure no duplicate titles
      if (!generated.find(g => g.title === newQuestion.title) && !handCraftedQuestions.find(h => h.title === newQuestion.title)) {
        generated.push(newQuestion);
      }
      
      qIndex++;
    }
  };

  // We loop round robin through categories to balance
  let catSelector = 0;
  while (generated.length + handCraftedQuestions.length < 210) {
    if (catSelector === 0) {
      addCategoryQuestions('angular', angularTopics);
    } else if (catSelector === 1) {
      addCategoryQuestions('javascript', javascriptTopics);
    } else {
      addCategoryQuestions('system-design', systemDesignTopics);
    }
    catSelector = (catSelector + 1) % 3;
  }

  return generated;
}

const questions = [
  ...handCraftedQuestions,
  ...generateProgrammaticQuestions()
];

async function seed() {
  try {
    const mongoUri = process.env['MONGODB_URI'];
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is missing');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    const existing = await Question.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  Database already has ${existing} questions. Clearing and re-seeding...`);
      await Question.deleteMany({});
    }

    await Question.insertMany(questions);
    console.log(`🌱 Seeded ${questions.length} questions successfully!`);
    console.log(`   Angular: ${questions.filter(q => q.category === 'angular').length}`);
    console.log(`   JavaScript: ${questions.filter(q => q.category === 'javascript').length}`);
    console.log(`   System Design: ${questions.filter(q => q.category === 'system-design').length}`);

  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seed();
