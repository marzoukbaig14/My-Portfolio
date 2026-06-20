// Real example diffs for the Committed demo, curated from the test split and
// verified through the live model. Each chip loads its diff into the demo.
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
];
