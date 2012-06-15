<!DOCTYPE html>
<html>
    <head>
        <title><?php print($data->getPrompt(); ?></title>
        <meta charset="UTF-8">
    </head>
    <body>
        <h1>{$data->getPrompt()}</h1>
        {foreach $data->getLinks() as $link}
            {if $link@first}
                
        <div id="links">
            {/if}
            
            <a href="{$link['href']}"{if isset($link['rel'])} rel="{$link['rel']}"{/if}>{if isset($link['prompt'])}{$link['prompt']}{else}{$link['href']}{/if}</a>
            {if $link@last}
                
        </div>
            {/if}
        {/foreach}
        
        {* If we are rendering a collection, output the collection headers *}
        {$template = $data->getCollectionTemplate()}
        {if $data->isCollection()}
            {if !is_null($template)}
        <table>
            <thead>
                <tr>
                    {foreach $template->getFields() as $fieldName => $fieldData}
                        
                    <th>{if is_null($fieldData->getPrompt())}{$fieldName}{else}{$fieldData->getPrompt()}{/if}</th>
                    {/foreach}
                    
                </tr>
            </thead>
            <tbody>
                {foreach $data->getItems() as $item}
                    
                <tr>
                    {foreach $template->getFields() as $fieldName => $fieldData}
                        
                    <td>{$item->getValue($fieldName)|escape}</td>
                    {/foreach}
                    
                </tr>
                {/foreach}
                
            </tbody>
        </table>
            {/if}
        {/if}
        
        {* Output the forms for creating new items by looking at the ones that support POST *}
        {foreach $data->getTemplates() as $template}
            {if $template->allowPost()}
                {if is_null($template->getName())}
                    {assign var=templatePrefix value="create_"}
                {else}
                    {assign var=templatePrefix value="create_`$template->getName()`_"}
                {/if}
                
        <form method="POST" action="{$data->getHref()}" enctype="multipart/form-data">
            <h2>{MiogenDictionary::populate(MiogenDictionary::STR_CREATE_NEW, array($data->getItemName()))}</h2>
            
            {foreach $template->getFields() as $fieldName => $fieldData}
                
            <div class="edit-field">
                <label for="{$templatePrefix}{$fieldName}">{$fieldData->getPrompt()}</label>
                {if $fieldData->getType() == 'text'}
                
                <input id="{$templatePrefix}{$fieldName}"
                       name="{$fieldName}"
                       type="text"{if !is_null($fieldData->getDefaultValue())} 
                       value="{$fieldData->getDefaultValue()}"{/if}{if $fieldData->isRequired()} 
                       required{/if}>
                {elseif $fieldData->getType() == 'numeric' || $fieldData->getType() == 'currency'}
                    
                <input id="{$templatePrefix}{$fieldName}"
                       name="{$fieldName}"
                       type="number"{if !is_null($fieldData->getDefaultValue())} 
                       value="{$fieldData->getDefaultValue()|escape}"{/if}{if $fieldData->isRequired()} 
                       required="true"{/if}{if !is_null($fieldData->getStep())} 
                       step="{$fieldData->getStep()}"{/if}{if !is_null($fieldData->getMin())} 
                       min="{$fieldData->getMin()}"{/if}{if !is_null($fieldData->getMax())} 
                       max="{$fieldData->getMax()}"{/if}>
                {/if}
                
            </div>
            {/foreach}
            
            <input type="submit" value="{MiogenDictionary::STR_SUBMIT}">
        </form>
                
            {/if}{* end of allow post *}
        {/foreach}
        
    </body>
</html>