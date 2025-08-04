#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Configuration
const JS_DIRS = ['assets/js', 'js', 'en/js'];
const OUTPUT_DIR = 'assets/js/min';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function minifyFile(inputPath, outputPath) {
    try {
        const code = fs.readFileSync(inputPath, 'utf8');
        const result = await minify(code, {
            compress: {
                dead_code: true,
                drop_debugger: true,
                conditionals: true,
                evaluate: true,
                booleans: true,
                loops: true,
                unused: true,
                hoist_funs: true,
                keep_fargs: false,
                hoist_vars: false,
                if_return: true,
                join_vars: true,
                side_effects: false
            },
            mangle: {
                toplevel: true
            },
            format: {
                comments: false
            }
        });

        if (result.error) {
            console.error(`Error minifying ${inputPath}:`, result.error);
            return false;
        }

        fs.writeFileSync(outputPath, result.code);
        
        const originalSize = fs.statSync(inputPath).size;
        const minifiedSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        
        console.log(`✓ ${path.basename(inputPath)}: ${originalSize} → ${minifiedSize} bytes (${savings}% smaller)`);
        return true;
    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error.message);
        return false;
    }
}

async function optimizeJavaScript() {
    console.log('🚀 Starting JavaScript optimization...\n');
    
    let totalFiles = 0;
    let successfulFiles = 0;
    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;

    for (const dir of JS_DIRS) {
        if (!fs.existsSync(dir)) {
            console.log(`⚠️  Directory ${dir} not found, skipping...`);
            continue;
        }

        console.log(`📁 Processing ${dir}/...`);
        
        const files = fs.readdirSync(dir)
            .filter(file => file.endsWith('.js') && !file.endsWith('.min.js'))
            .filter(file => file !== 'main.js'); // Skip main.js as it's loaded on every page

        for (const file of files) {
            const inputPath = path.join(dir, file);
            const outputPath = path.join(OUTPUT_DIR, file.replace('.js', '.min.js'));
            
            totalFiles++;
            const success = await minifyFile(inputPath, outputPath);
            
            if (success) {
                successfulFiles++;
                totalOriginalSize += fs.statSync(inputPath).size;
                totalMinifiedSize += fs.statSync(outputPath).size;
            }
        }
        
        console.log('');
    }

    // Also minify main.js in place
    const mainJsPath = 'assets/js/main.js';
    if (fs.existsSync(mainJsPath)) {
        console.log('📁 Processing main.js...');
        const success = await minifyFile(mainJsPath, 'assets/js/main.min.js');
        if (success) {
            totalFiles++;
            successfulFiles++;
            totalOriginalSize += fs.statSync(mainJsPath).size;
            totalMinifiedSize += fs.statSync('assets/js/main.min.js').size;
        }
    }

    console.log('📊 Summary:');
    console.log(`   Files processed: ${successfulFiles}/${totalFiles}`);
    console.log(`   Total size reduction: ${totalOriginalSize} → ${totalMinifiedSize} bytes`);
    console.log(`   Total savings: ${((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(1)}%`);
    console.log(`   Minified files saved to: ${OUTPUT_DIR}/`);
}

// Run the optimization
optimizeJavaScript().catch(console.error);