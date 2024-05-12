
(() => {
	class TramDeco{static processTemplate(e){[...e.content.children].forEach(e=>{TramDeco.define(e)})}static define(newElement){const tagName=newElement.tagName.toLowerCase(),shadowRoot=newElement.shadowRoot,{mode,delegatesFocus}=shadowRoot,range=document.createRange();range.selectNodeContents(shadowRoot);class BaseTDElement extends HTMLElement{constructor(){super(),this.attachShadow({mode:mode,delegatesFocus:delegatesFocus}),this.shadowRoot.append(range.cloneContents())}}const modifiedConstructor=newElement.querySelector('script[td-method="constructor"]');class TDElement extends BaseTDElement{constructor(){super(),eval(modifiedConstructor?.textContent||"")}}newElement.querySelectorAll("script[td-method]").forEach(lifecycleScript=>{const methodName=lifecycleScript.getAttribute("td-method");TDElement.prototype[methodName]=function(){eval(lifecycleScript.textContent)}}),newElement.querySelectorAll("script[td-property]").forEach(propertyScript=>{const propertyName=propertyScript.getAttribute("td-property");Object.defineProperty(TDElement,propertyName,{get:function(){return eval(propertyScript.textContent)}})}),customElements.define(tagName,TDElement)}}

	const importTemplate = document.createElement('template')
	importTemplate.setHTMLUnsafe(`<pull-to-refresh>
	<template shadowrootmode="open">
		<style>
			:host {
				display: block;
				scroll-snap-type: y mandatory;
				overflow: auto;
				height: 100vh;
				overscroll-behavior: contain;

				flex-flow: column nowrap;
			}

			#mainContent::slotted(*) {
				scroll-snap-align: start;
				scroll-snap-stop: always;

				min-height: 100vh;
			}

			#pullStop {
				display: block;
				scroll-snap-align: start;
			}
		</style>

		<div id="pullStop"></div>
		<slot id="pullArea" name="pull-area"></slot>
		<slot id="mainContent"></slot>
	</template>

	<script td-method="connectedCallback">
		// when the main content has been slotted in, scroll instantly to that element
		this.shadowRoot.getElementById('mainContent').addEventListener('slotchange', () => {
			this.mainContent = this.shadowRoot.getElementById('mainContent').assignedElements()[0];
			this.mainContent.scrollIntoView({ behavior: 'instant' });
		});

		// add an event listener to this element for when scrolling ends, so we can trigger refresh
		this.addEventListener('scrollend', async () => {
			if (this.scrollTop <= 0) {
				await this?.pull?.();
				this.mainContent.scrollIntoView({ behavior: 'smooth' });
			}
		});
	</script>
</pull-to-refresh>
`)

	TramDeco.processTemplate(importTemplate);
})()
