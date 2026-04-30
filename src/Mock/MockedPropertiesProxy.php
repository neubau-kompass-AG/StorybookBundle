<?php

namespace Storybook\Mock;

use Symfony\UX\TwigComponent\ComputedPropertiesProxy;

/**
 * Wraps a Twig Component to use mocked methods defined in a provider.
 *
 * Heavily inspired from {@see ComputedPropertiesProxy}.
 *
 * @author Nicolas Rigaud <squrious@protonmail.com>
 *
 * @internal
 */
final class MockedPropertiesProxy
{
    public function __construct(
        private readonly object $component,
        private readonly object $provider,
        private readonly array $mockedMethods,
    ) {
    }

    public function __call(string $name, array $args): mixed
    {
        if (\array_key_exists($name, $this->mockedMethods)) {
            return $this->callMockedMethod($name, $args);
        }

        if (isset($this->component->$name)) {
            // try property
            return $this->component->$name;
        }

        if ($this->component instanceof \ArrayAccess && isset($this->component[$name])) {
            return $this->component[$name];
        }

        return $this->component->{$this->normalizeMethod($name)}(...$args);
    }

    private function callMockedMethod(string $name, array $args): mixed
    {
        $invocationContext = new MockInvocationContext($this->component, $args);

        return $this->provider->{$this->mockedMethods[$name]}($invocationContext);
    }

    private function normalizeMethod(string $name): string
    {
        if (method_exists($this->component, $name)) {
            return $name;
        }

        foreach (['get', 'is', 'has'] as $prefix) {
            if (method_exists($this->component, $method = \sprintf('%s%s', $prefix, ucfirst($name)))) {
                return $method;
            }
        }

        throw new \InvalidArgumentException(\sprintf('Component "%s" does not have a "%s" method.', $this->component::class, $name));
    }
}
