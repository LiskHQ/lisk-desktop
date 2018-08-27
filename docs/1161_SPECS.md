### Specification

- Each component will have a uniqueID
- uniqueID should be formed by componentName. 
- Settings store will be enhanced with a new key `feedback`
- each entry in feedback will be indexed by componentID, and containing the following fields
```
settings: {
	feedback: {
		enabledIn: [[String], [String]],
		showInterval: [Date/Millisecconds],
		components: {
			[componentID]: {
				lastGivenOn: [Date/Millisecconds],
				choosenToBeHidden: [Boolean],
			}
		}
	}
}
```

Pseudo code for rendering a component:

```
onFeedbackShouldShow() =>

componentObj  = settings.feedback.components.componentId

if componentId
	todayDate = new Date().getTime()
	if not componentObj.choosenToBeHIdden
		if componentObj.lastGivenOn > todayDate + settings.feedback.showInterval
		componentObj.lastGivenOn = todayDate;
		render feature feedback
		return;
render component;

...

on feedback closed
if user choosenToBeHIdden 
	componentObj.choosenToBeHIdden = true

```

#### When to show feature feedback

* on component focus, we set a flag, the flag is updated on every focus event on component. When component is blur, we show feedback if interval is greater than a constant. 
* on beforeunload of window
* on componentWillUnmount - will happen most likely when transitioning between views, e.g. Dashboard --> Wallet

### Edge cases

* multiple components enabled on same page (Dashboard) the view might look overcrowded. We might impose a limit, in showing a component feedback only if 
`settings.feedback.current` is empty.