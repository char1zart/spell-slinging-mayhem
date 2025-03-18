
// Function to create a magic spark effect at a position
export const createMagicSpark = (
  x: number, 
  y: number,
  container: HTMLElement | null
): void => {
  if (!container) return;
  
  // Create 5-10 sparks
  const sparkCount = 5 + Math.floor(Math.random() * 6);
  
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'magic-spark';
    
    // Random position offset
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;
    
    // Random spark color
    const colors = [
      'rgba(139, 92, 246, 0.8)',  // Purple
      'rgba(217, 70, 239, 0.8)',  // Magenta
      'rgba(249, 115, 22, 0.8)',  // Orange
      'rgba(255, 255, 255, 0.8)', // White
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty('--x', `${xOffset}px`);
    spark.style.setProperty('--y', `${yOffset}px`);
    spark.style.background = `radial-gradient(circle, #f5f5f5 0%, ${color} 60%, transparent 100%)`;
    spark.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
    
    container.appendChild(spark);
    
    // Remove the spark after animation completes
    setTimeout(() => {
      if (spark.parentNode === container) {
        container.removeChild(spark);
      }
    }, 1000);
  }
};

// Function to create a card hover effect
export const cardHoverEffect = (
  element: HTMLElement | null, 
  isHovering: boolean
): void => {
  if (!element) return;
  
  if (isHovering) {
    element.style.transform = 'translateY(-15px) rotate(2deg)';
    element.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.6)';
    element.style.zIndex = '10';
  } else {
    element.style.transform = '';
    element.style.boxShadow = '';
    element.style.zIndex = '';
  }
};

// Function to animate a spell cast between two points
export const animateSpellCast = (
  sourceElement: HTMLElement | null,
  targetElement: HTMLElement | null,
  spellType: 'source' | 'quality' | 'delivery',
  container: HTMLElement | null,
  onComplete?: () => void
): void => {
  if (!sourceElement || !targetElement || !container) {
    if (onComplete) onComplete();
    return;
  }
  
  // Get positions
  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  
  const sourceX = sourceRect.left + sourceRect.width / 2;
  const sourceY = sourceRect.top + sourceRect.height / 2;
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  
  // Create projectile element
  const projectile = document.createElement('div');
  projectile.className = 'absolute rounded-full z-50 transform -translate-x-1/2 -translate-y-1/2';
  
  // Style based on spell type
  switch (spellType) {
    case 'source':
      projectile.className += ' bg-spell-source';
      break;
    case 'quality':
      projectile.className += ' bg-spell-quality';
      break;
    case 'delivery':
      projectile.className += ' bg-spell-delivery';
      break;
  }
  
  // Size and initial position
  projectile.style.width = '20px';
  projectile.style.height = '20px';
  projectile.style.left = `${sourceX}px`;
  projectile.style.top = `${sourceY}px`;
  projectile.style.boxShadow = '0 0 20px currentColor';
  
  // Add to DOM
  container.appendChild(projectile);
  
  // Animate
  const startTime = performance.now();
  const duration = 600; // milliseconds
  
  // Add trail effect
  const createTrail = setInterval(() => {
    const trail = document.createElement('div');
    trail.className = `absolute rounded-full opacity-70 z-40`;
    trail.style.left = projectile.style.left;
    trail.style.top = projectile.style.top;
    trail.style.width = '15px';
    trail.style.height = '15px';
    
    // Style based on spell type
    switch (spellType) {
      case 'source':
        trail.style.background = 'rgba(14, 165, 233, 0.7)';
        break;
      case 'quality':
        trail.style.background = 'rgba(139, 92, 246, 0.7)';
        break;
      case 'delivery':
        trail.style.background = 'rgba(249, 115, 22, 0.7)';
        break;
    }
    
    container.appendChild(trail);
    
    // Fade out the trail
    setTimeout(() => {
      trail.style.transition = 'all 0.3s ease-out';
      trail.style.opacity = '0';
      trail.style.transform = 'scale(0.5)';
      
      // Remove after animation
      setTimeout(() => {
        if (trail.parentNode === container) {
          container.removeChild(trail);
        }
      }, 300);
    }, 10);
  }, 50);
  
  const animate = (timestamp: number) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    
    // Bezier curve for arc trajectory
    const bezierY = sourceY + (targetY - sourceY) * easeOutProgress - Math.sin(easeOutProgress * Math.PI) * 100;
    
    // Update position
    projectile.style.left = `${sourceX + (targetX - sourceX) * easeOutProgress}px`;
    projectile.style.top = `${bezierY}px`;
    
    // Continue animation
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Animation complete
      clearInterval(createTrail);
      
      // Create impact effect
      createMagicSpark(targetX, targetY, container);
      
      // Apply shake effect to target
      targetElement.classList.add('animate-damage-shake');
      setTimeout(() => {
        targetElement.classList.remove('animate-damage-shake');
      }, 500);
      
      // Remove projectile
      if (projectile.parentNode === container) {
        container.removeChild(projectile);
      }
      
      // Call completion callback
      if (onComplete) onComplete();
    }
  };
  
  requestAnimationFrame(animate);
};

// Function to animate card entrance
export const animateCardEntrance = (
  element: HTMLElement | null,
  delay: number = 0
): void => {
  if (!element) return;
  
  element.style.opacity = '0';
  element.style.transform = 'translateY(50px) scale(0.8)';
  
  setTimeout(() => {
    element.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0) scale(1)';
  }, delay);
};
