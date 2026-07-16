// Example diffs for the Committed demo. The first entries are curated from the
// test split; the later ones are representative single-file changes crafted to
// resemble real-world diffs. Every entry is verified through the live model to
// produce a well-formed Conventional Commit. Each chip loads its diff into the demo.
//
// Shape: { id, label, language, diff }. `label` is the chip text; `language`
// is shown as a small tag on the chip.

export const examples = [
  {
    id: "cancellation-tokens",
    label: "add cancellation token support",
    language: "C#",
    diff: `@@ -20,13 +20,17 @@ public partial class RestClient {
/// Executes the request synchronously, authenticating if needed
/// </summary>
/// <param name="request">Request to be executed</param>
- public RestResponse Execute(RestRequest request) => AsyncHelpers.RunSync(() => ExecuteAsync(request));
+ /// <param name="cancellationToken">The cancellation token</param>
+ public RestResponse Execute(RestRequest request, CancellationToken cancellationToken = default)
+ => AsyncHelpers.RunSync(() => ExecuteAsync(request, cancellationToken));
/// <summary>
/// A specialized method to download files as streams.
/// </summary>
/// <param name="request">Pre-configured request instance.</param>
+ /// <param name="cancellationToken">The cancellation token</param>
/// <returns>The downloaded stream.</returns>
[PublicAPI]
- public Stream? DownloadStream(RestRequest request) => AsyncHelpers.RunSync(() => DownloadStreamAsync(request));
+ public Stream? DownloadStream(RestRequest request, CancellationToken cancellationToken = default)
+ => AsyncHelpers.RunSync(() => DownloadStreamAsync(request, cancellationToken));
}
`,
  },
  {
    id: "execshort-kubectl",
    label: "use ExecShort for kubectl get",
    language: "Go",
    diff: `+ cmdRes := kub.ExecShort(fmt.Sprintf("%s -n %s get deploy %s -o json", KubectlCmd, namespace, name))
if cmdRes == nil {
kub.logger.Infof("kubectl.Exec returned nil result while getting Deployment for %s/%s", namespace, name)
return false
@@ -613,7 +613,7 @@ func (kub *Kubectl) WaitforDaemonSetReady(namespace, name string, timeout time.D
body := func() bool {
ds := apps_v1.DaemonSet{}
- cmdRes := kub.Exec(fmt.Sprintf("%s -n %s get daemonset %s -o json", KubectlCmd, namespace, name))
+ cmdRes := kub.ExecShort(fmt.Sprintf("%s -n %s get daemonset %s -o json", KubectlCmd, namespace, name))
if cmdRes == nil {
kub.logger.Infof("kubectl.Exec returned nil result while getting DaemonSet for %s/%s", namespace, name)
return false
`,
  },
  {
    id: "rename-subcomponent",
    label: "rename React subcomponent",
    language: "JavaScript",
    diff: `@@ -4,7 +4,7 @@ import cx from 'classnames'
import Commentsquare from '@schibstedspain/sui-svgiconset/lib/Commentsquare'
import ImageLazyLoad from '@schibstedspain/sui-image-lazy-load'
-const renderCardArticleMedia = ({ src, alt = '' }) => (
+const CardArticleMedia = ({ src, alt = '' }) => (
<div className='sui-CardArticle-media'>
<img src={src} alt={alt} />
</div>
@@ -35,7 +35,7 @@ export default function CardArticle (props) {
<Link href={link} className='sui-CardArticle-link'>
{lazyLoad
? <ImageLazyLoad {...lazyLoad} {...media} />
- : renderCardArticleMedia(media)
+ : <CardArticleMedia {...media} />
}
</Link>
<div className='sui-CardArticle-info'>
`,
  },
  {
    id: "fix-docstring-typo",
    label: "fix docstring typo",
    language: "Python",
    diff: `@@ -1639,7 +1639,7 @@ def moveaxis(a, source, destination):
>>> np.transpose(x).shape
(5, 4, 3)
- >>> np.swapaxis(x, 0, -1).shape
+ >>> np.swapaxes(x, 0, -1).shape
(5, 4, 3)
>>> np.moveaxis(x, [0, 1], [-1, -2]).shape
(5, 4, 3)
`,
  },
  {
    id: "test-back-button",
    label: "test the back button",
    language: "Kotlin",
    diff: `@@ -84,6 +84,11 @@ class ExternalInputPluginTest {
assertPressedKeyCodeEvent(Key.RIGHT, KeyEvent.KEYCODE_DPAD_RIGHT)
}
+ @Test
+ fun \`should trigger KEY_PRESSED event for BACK button\`() {
+ assertPressedKeyCodeEvent(Key.BACK, KeyEvent.KEYCODE_BACK)
+ }
+
private fun assertPressedKeyCodeEvent(expectedKeyCode: Key, keyToHold: Int){
var keyCode: String? = null
`,
  },
  {
    id: "dedupe-inflight-loads",
    label: "dedupe in-flight user loads",
    language: "TypeScript",
    diff: `@@ -8,19 +8,31 @@ export class UserLoader {
private cache = new Map<string, User>();
+ private inflight = new Map<string, Promise<User>>();

- async load(id: string): Promise<User> {
- if (this.cache.has(id)) return this.cache.get(id)!;
- const res = await fetch(\`/api/users/\${id}\`);
- const user = (await res.json()) as User;
- this.cache.set(id, user);
- return user;
- }
+ async load(id: string): Promise<User> {
+ const cached = this.cache.get(id);
+ if (cached) return cached;
+ const pending = this.inflight.get(id);
+ if (pending) return pending;
+ const request = fetch(\`/api/users/\${id}\`)
+ .then(async (res) => {
+ if (!res.ok) throw new Error(\`failed to load user \${id}: \${res.status}\`);
+ const user = (await res.json()) as User;
+ this.cache.set(id, user);
+ return user;
+ })
+ .finally(() => this.inflight.delete(id));
+ this.inflight.set(id, request);
+ return request;
+ }
}
`,
  },
  {
    id: "result-error-enum",
    label: "return Result instead of panicking",
    language: "Rust",
    diff: `@@ -1,16 +1,29 @@
use std::fs;
+ use std::num::ParseIntError;
+
+ #[derive(Debug)]
+ enum ConfigError {
+ Io(std::io::Error),
+ Parse(ParseIntError),
+ Missing(&'static str),
+ }
+
+ impl From<std::io::Error> for ConfigError {
+ fn from(e: std::io::Error) -> Self { ConfigError::Io(e) }
+ }
+ impl From<ParseIntError> for ConfigError {
+ fn from(e: ParseIntError) -> Self { ConfigError::Parse(e) }
+ }

- fn load_port(path: &str) -> u16 {
- let text = fs::read_to_string(path).unwrap();
- let line = text.lines().find(|l| l.starts_with("port=")).unwrap();
- line["port=".len()..].parse().unwrap()
- }
+ fn load_port(path: &str) -> Result<u16, ConfigError> {
+ let text = fs::read_to_string(path)?;
+ let line = text.lines().find(|l| l.starts_with("port="))
+ .ok_or(ConfigError::Missing("port"))?;
+ Ok(line["port=".len()..].parse()?)
+ }
`,
  },
  {
    id: "unique-ptr-scene-nodes",
    label: "use unique_ptr for scene nodes",
    language: "C++",
    diff: `@@ -6,7 +6,7 @@ struct Node {
std::string name;
- std::vector<Node*> children;
+ std::vector<std::unique_ptr<Node>> children;
};

@@ -18,19 +18,16 @@ class Scene {
public:
- Scene() : root_(new Node()) {}
- ~Scene() { delete root_; }
+ Scene() : root_(std::make_unique<Node>()) {}

- Node* addChild(Node* parent) {
- Node* child = new Node();
- parent->children.push_back(child);
- return child;
- }
+ Node* addChild(Node* parent) {
+ auto child = std::make_unique<Node>();
+ Node* raw = child.get();
+ parent->children.push_back(std::move(child));
+ return raw;
+ }

private:
- Node* root_;
+ std::unique_ptr<Node> root_;
};
`,
  },
];
